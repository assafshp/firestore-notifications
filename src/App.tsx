import React, { useState } from 'react';
import { Bell, MessageSquare, X } from 'lucide-react';
import axios from 'axios';
import { NotificationList } from './components/NotificationList';
import { NotificationPopup } from './components/NotificationPopup';
import { useNotifications } from './hooks/useNotifications';

const BASE_URL = 'https://peppy-salmiakki-12cd2d.netlify.app/.netlify/functions';

function App() {
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const { 
    notifications,
    deleteNotification,
    newNotification,
    clearNewNotification
  } = useNotifications();

  const handleHelloWorld = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/hello-world`, { message });
      setResponse(res.data);
      setShowPopup(true);
    } catch (error) {
      setResponse({ error: 'Failed to send message' });
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFirestore = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/send-firestore-notification`, {
        message: notification,
      });
      setResponse(res.data);
      setShowPopup(true);
    } catch (error) {
      setResponse({ error: 'Failed to save notification' });
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MessageSquare className="mr-2" /> Hello World Function
              </h2>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={handleHelloWorld}
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Bell className="mr-2" /> Firestore Notification
              </h2>
              <input
                type="text"
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                placeholder="Enter notification message"
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={handleFirestore}
                disabled={loading}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:opacity-50"
              >
                Save to Firestore
              </button>
            </div>
          </div>

          <div>
            <NotificationList 
              notifications={notifications} 
              onDelete={deleteNotification}
            />
          </div>
        </div>
      </div>

      {/* Response Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">API Response</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* New Notification Popup */}
      {newNotification && (
        <NotificationPopup
          message={newNotification}
          onClose={clearNewNotification}
        />
      )}
    </div>
  );
}

export default App;