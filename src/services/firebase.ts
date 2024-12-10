import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFirestore, collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { FIREBASE_CONFIG, VAPID_KEY } from '../config/firebase';

const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);
export const db = getFirestore(app);

export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support desktop notifications');
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission was not granted');
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready;

    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!currentToken) {
      throw new Error('No registration token available');
    }

    return currentToken;
  } catch (error) {
    console.error('Error setting up notifications:', error);
    throw error;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve({
        type: 'fcm',
        ...payload
      });
    });
  });

interface FirestoreNotification {
  id: string;
  message: string;
  timestamp: Timestamp;
}

export const subscribeToFirestore = (callback: (notification: FirestoreNotification) => void) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(notificationsRef, orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const data = change.doc.data();
        console.log('New Firestore notification:', data);

        if (data.timestamp) {
          const notification = {
            id: change.doc.id,
            message: data.message || '',
            timestamp: data.timestamp as Timestamp
          };

          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification('New Firestore Message', {
              body: notification.message,
              icon: '/vite.svg'
            });
          }

          callback(notification);
        }
      }
    });
  }, (error) => {
    console.error('Error listening to Firestore:', error);
  });
};