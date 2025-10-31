'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { CriticalAlert } from '@/lib/definitions';
import AlertsTable from './AlertsTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'Critical_Alerts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const alertsData: CriticalAlert[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          alertsData.push({
            id: doc.id,
            asset_ID: data.asset_ID,
            part_PN: data.part_PN,
            location_coords: data.location_coords,
            estimated_failure_time: data.estimated_failure_time,
            status: data.status,
            timestamp: data.timestamp as Timestamp,
            order_timestamp: data.order_timestamp,
            maintenance_triggered: data.maintenance_triggered,
          });
        });
        setAlerts(alertsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching alerts:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
          <AlertsTable alerts={alerts} />
        )}
      </CardContent>
    </Card>
  );
}
