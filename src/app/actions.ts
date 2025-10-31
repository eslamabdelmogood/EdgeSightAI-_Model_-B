'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const confirmMaintenanceRequestSchema = z.string().min(1, 'Alert ID is required.');

export async function confirmMaintenanceRequest(alertId: string) {
  try {
    const validatedAlertId = confirmMaintenanceRequestSchema.parse(alertId);
    const alertRef = adminDb.collection('Critical_Alerts').doc(validatedAlertId);

    // 1. Update status to 'Awaiting Confirmation' and set trigger timestamp
    await alertRef.update({
      status: 'Awaiting Confirmation',
      maintenance_triggered: new Date().toISOString(),
    });

    console.log(`[EdgeSight] Maintenance request confirmed for alert: ${validatedAlertId}. Simulating order placement...`);
    revalidatePath('/'); // Revalidate to show 'Awaiting Confirmation' status immediately

    // 2. Simulate sending an order to an external Marketplace API (e.g., an HTTP POST request)
    // We use a delay to simulate a network call.
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[EdgeSight] Simulated marketplace order successful for alert: ${validatedAlertId}.`);

    // 3. Update the document status to 'Order Confirmed' and add the order timestamp
    await alertRef.update({
      status: 'Order Confirmed',
      order_timestamp: FieldValue.serverTimestamp(),
    });

    console.log(`[EdgeSight] Alert ${validatedAlertId} status updated to 'Order Confirmed'.`);
    revalidatePath('/'); // Revalidate again to show the final 'Order Confirmed' status
    
    return { success: true, message: 'Maintenance request processed successfully.' };
  } catch (error) {
    console.error('Error confirming maintenance request:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid input.', error: error.errors };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
