import { adminDb } from '@/lib/firebase/admin';
import { notFound } from 'next/navigation';
import type { CriticalAlert } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { HardHat, Bot, MapPin, Wrench, Clock, FileText } from 'lucide-react';
import { suggestMaintenanceActions } from '@/ai/flows/suggest-maintenance-actions';
import { Timestamp } from 'firebase-admin/firestore';

async function getAlert(id: string) {
  const alertDoc = await adminDb.collection('Critical_Alerts').doc(id).get();
  if (!alertDoc.exists) {
    return null;
  }
  const data = alertDoc.data() as Omit<CriticalAlert, 'id'>;
  // Firestore Timestamps need to be converted for serialization
  return {
    id: alertDoc.id,
    ...data,
    timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
    order_timestamp: data.order_timestamp ? (data.order_timestamp as Timestamp).toDate().toISOString() : undefined,
  };
}

export default async function AlertDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const alert = await getAlert(params.id);

  if (!alert) {
    notFound();
  }

  const aiSuggestions = await suggestMaintenanceActions({
    asset_ID: alert.asset_ID,
    part_PN: alert.part_PN,
    location_coords: alert.location_coords,
    estimated_failure_time: alert.estimated_failure_time,
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HardHat className="h-6 w-6" />
            <span>Alert Details for {alert.asset_ID}</span>
          </CardTitle>
          <CardDescription>
            Part Number: {alert.part_PN}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge>{alert.status}</Badge>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{alert.location_coords}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
                <p className="font-medium">Estimated Failure Time</p>
                <p className="text-muted-foreground">{format(parseISO(alert.estimated_failure_time), 'PPP, p')}</p>
            </div>
          </div>
           <div className="flex items-start gap-2">
            <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
                <p className="font-medium">Reported At</p>
                <p className="text-muted-foreground">{format(parseISO(alert.timestamp), 'PPP, p')}</p>
            </div>
          </div>
          {alert.order_timestamp && (
             <div className="flex items-start gap-2">
                <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-medium">Order Placed At</p>
                    <p className="text-muted-foreground">{format(parseISO(alert.order_timestamp), 'PPP, p')}</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-primary/5 dark:bg-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI-Powered Suggestions
          </CardTitle>
          <CardDescription>
            Recommended actions based on alert data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <Wrench className="h-4 w-4" />
              Suggested Actions
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {aiSuggestions.suggestedActions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4" />
              Reasoning
            </h4>
            <p className="text-sm text-muted-foreground">{aiSuggestions.reasoning}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
