import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminDb: ReturnType<typeof getFirestore>;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  const serviceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
      'base64'
    ).toString('utf-8')
  );

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  adminDb = getFirestore();
} else {
  console.warn(
    'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK will not be initialized.'
  );
  // Create a mock or no-op implementation for environments where the key is not available
  // This prevents the app from crashing during build or in environments without the key.
  adminDb = {} as ReturnType<typeof getFirestore>;
}


export { adminDb };
