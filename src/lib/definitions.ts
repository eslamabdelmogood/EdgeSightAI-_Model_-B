import type { Timestamp } from 'firebase/firestore';

export type CriticalAlertStatus =
  | 'Pending Order'
  | 'Awaiting Confirmation'
  | 'Order Confirmed'
  | 'Ready for Pickup'
  | 'Completed';

export type CriticalAlert = {
  id: string;
  asset_ID: string;
  part_PN: string;
  location_coords: string;
  estimated_failure_time: string;
  status: CriticalAlertStatus;
  timestamp: Timestamp;
  category: 'Airplane' | 'Ship' | 'Factory' | 'Disaster';
  order_timestamp?: Timestamp;
  maintenance_triggered?: string;
};
