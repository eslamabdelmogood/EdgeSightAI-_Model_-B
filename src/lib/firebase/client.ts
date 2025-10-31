import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

type FirebaseServices = {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
};

let services: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (services) {
    return services;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);

  services = { app, db, auth };
  return services;
}
