'use client';

import { useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CriticalAlert, CriticalAlertStatus } from '@/lib/definitions';
import { format, parseISO } from 'date-fns';
import { confirmMaintenanceRequest } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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

  const handleClick = () => {
    startTransition(async () => {
      const result = await confirmMaintenanceRequest(alertId);
      if (result.success) {
        toast({
          title: 'Processing Request',
          description: 'Maintenance order is being processed.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Part Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden lg:table-cell">Est. Failure</TableHead>
            <TableHead className="hidden lg:table-cell">Reported</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id} className="cursor-pointer" onClick={() => handleRowClick(alert.id)}>
              <TableCell className="font-medium">{alert.asset_ID}</TableCell>
              <TableCell>{alert.part_PN}</TableCell>
              <TableCell>
                <StatusBadge status={alert.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">{alert.location_coords}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {format(parseISO(alert.estimated_failure_time), 'PPp')}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {alert.timestamp ? format(alert.timestamp.toDate(), 'PPp') : 'N/A'}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                {alert.status === 'Pending Order' && (
                  <ConfirmButton alertId={alert.id} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
