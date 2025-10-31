'use client';

import { useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CriticalAlert, CriticalAlertStatus } from '@/lib/definitions';
import { format, parseISO } from 'date-fns';
import { confirmMaintenanceRequestClient } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';

function StatusBadge({ status }: { status: CriticalAlertStatus }) {
  const variant: 'default' | 'secondary' | 'destructive' | 'outline' =
    status === 'Order Confirmed'
      ? 'default'
      : status === 'Pending Order'
      ? 'secondary'
      : status === 'Completed'
      ? 'default'
      : 'outline';
  
  const className = 
    status === 'Completed' ? 'bg-green-600/80' : 
    status === 'Ready for Pickup' ? 'bg-cyan-500/80 text-black' : 
    status === 'Awaiting Confirmation' ? 'bg-amber-500/80' : '';

  return <Badge variant={variant} className={className}>{status}</Badge>;
}

function ConfirmButton({ alertId }: { alertId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firestore) return;
    startTransition(async () => {
      try {
        await confirmMaintenanceRequestClient(firestore, alertId);
        toast({
          title: 'Processing Request',
          description: 'Maintenance order is being processed.',
        });
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <Button size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? 'Processing...' : 'Confirm Request'}
    </Button>
  );
}

export default function AlertsTable({ alerts }: { alerts: CriticalAlert[] }) {
  const router = useRouter();
  
  const handleRowClick = (alertId: string) => {
    router.push(`/alerts/${alertId}`);
  };

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-[1fr,1fr,1fr,1fr,auto] items-center p-4 border-b font-medium text-muted-foreground">
        <div>Asset ID</div>
        <div>Part Number</div>
        <div>Status</div>
        <div>Location</div>
        <div className="text-right">Action</div>
      </div>
      <div className="divide-y">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className="grid grid-cols-[1fr,1fr,1fr,1fr,auto] items-center p-4 cursor-pointer hover:bg-muted/50"
            onClick={() => handleRowClick(alert.id)}
          >
            <div className="font-medium">{alert.asset_ID}</div>
            <div>{alert.part_PN}</div>
            <div><StatusBadge status={alert.status} /></div>
            <div>{alert.location_coords}</div>
            <div className="text-right">
              {alert.status === 'Pending Order' && (
                <ConfirmButton alertId={alert.id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
