'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import type { CriticalAlert } from '@/lib/definitions';
import AlertsTable from './AlertsTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

export default function AlertsDashboard() {
  const firestore = useFirestore();

  const alertsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'Critical_Alerts'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: alerts, loading } = useCollection<CriticalAlert>(alertsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Alerts Feed</CardTitle>
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
