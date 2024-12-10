import React from 'react';
import { Bell } from 'lucide-react';

interface EnableNotificationsProps {
  onEnable: () => Promise<void>;
  isEnabled: boolean;
  error?: string;
}

export const EnableNotifications: React.FC<EnableNotificationsProps> = ({
  onEnable,
  isEnabled,
  error
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Notification Settings
      </h2>
      
      {error ? (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      <button
        onClick={onEnable}
        disabled={isEnabled}
        className={`w-full p-2 rounded flex items-center justify-center ${
          isEnabled
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        <Bell className="mr-2 h-4 w-4" />
        {isEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
      </button>

      {isEnabled && (
        <p className="mt-2 text-sm text-gray-600">
          You will receive notifications for new messages and updates.
        </p>
      )}
    </div>
  );
};