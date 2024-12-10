import * as admin from 'firebase-admin';
import { serviceAccount } from '../config/firebase-config';

export const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
  }
  return admin;
};