'use client';

import { useMemo } from 'react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { CriticalAlert } from '@/lib/definitions';
import AlertsTable from './AlertsTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

type CategoryAlertsProps = {
  category: 'Airplane' | 'Ship' | 'Factory' | 'Disaster';
  title: string;
};

export default function CategoryAlerts({ category, title }: CategoryAlertsProps) {
  const firestore = useFirestore();

  const alertsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'Critical_Alerts'),
      where('category', '==', category),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, category]);

  const { data: alerts, loading } = useCollection<CriticalAlert>(alertsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <AlertsTable alerts={alerts || []} />
        )}
      </CardContent>
    </Card>
  );
}
