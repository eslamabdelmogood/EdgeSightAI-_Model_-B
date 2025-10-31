import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for validating the incoming oneM2M payload
const oneM2MSchema = z.object({
  asset_ID: z.string().min(1, 'asset_ID is required'),
  part_PN: z.string().min(1, 'part_PN is required'),
  location_coords: z.string().min(1, 'location_coords is required'),
  estimated_failure_time: z.string().datetime('estimated_failure_time must be a valid ISO date string'),
  category: z.enum(['Airplane', 'Ship', 'Factory', 'Disaster']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against the schema
    const validation = oneM2MSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid payload', errors: validation.error.errors }, { status: 400 });
    }

    const { asset_ID, part_PN, location_coords, estimated_failure_time, category } = validation.data;

    // Create a new document in the 'Critical_Alerts' collection
    const newAlert = {
      asset_ID,
      part_PN,
      location_coords,
      estimated_failure_time,
      category,
      status: 'Pending Order',
      timestamp: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection('Critical_Alerts').add(newAlert);
    
    console.log(`[EdgeSight] New critical alert received and stored with ID: ${docRef.id}`);

    // Immediately respond with HTTP 200 to confirm receipt
    return NextResponse.json({ message: 'Alert received successfully', alert_id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('Error processing oneM2M alert:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
