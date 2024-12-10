import { useState, useEffect } from 'react';
import { subscribeToFirestore } from '../services/firebase';
import { showBrowserNotification } from '../services/notifications';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'firestore';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to Firestore notifications
    const unsubscribe = subscribeToFirestore((notification) => {
      const newNotif = {
        id: notification.id,
        message: notification.message,
        timestamp: notification.timestamp.toDate(),
        type: 'firestore' as const
      };
      
      setNotifications(prev => [newNotif, ...prev]);
      setNewNotification(notification.message);
      showBrowserNotification('New Firestore Message', notification.message);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNewNotification = () => {
    setNewNotification(null);
  };

  return { 
    notifications,
    deleteNotification,
    newNotification,
    clearNewNotification
  };
};