import React from 'react';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'firestore';
}

interface NotificationListProps {
  notifications: Notification[];
  onDelete: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onDelete }) => {
  // Get only the latest 3 notifications
  const latestNotifications = notifications.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Latest Notifications
      </h2>
      <div className="space-y-4">
        {latestNotifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet</p>
        ) : (
          latestNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r relative group"
            >
              <button
                onClick={() => onDelete(notification.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete notification"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
              <div className="flex items-start justify-between pr-8">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-medium">Firestore Message</h3>
                </div>
                <span className="text-xs text-gray-500">
                  {notification.timestamp.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{notification.message}</p>
            </div>
          ))
        )}
        {notifications.length > 3 && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Showing latest 3 of {notifications.length} notifications
          </p>
        )}
      </div>
    </div>
  );
};