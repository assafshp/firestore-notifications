import { Handler } from '@netlify/functions';
import { handleCors } from './utils/cors';
import { createResponse } from './utils/response';
import { initializeFirebase } from './utils/firebase-admin';

const admin = initializeFirebase();

export const handler: Handler = async (event) => {
  const corsResponse = await handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { token, title, body } = JSON.parse(event.body || '{}');

    if (!token) {
      return createResponse(400, { error: 'FCM token is required' });
    }

    const message = {
      notification: {
        title: title || 'New Notification',
        body: body || 'You have a new notification',
      },
      token,
    };

    const response = await admin.messaging().send(message);
    return createResponse(200, { success: true, messageId: response });
  } catch (error) {
    return createResponse(500, { error: 'Failed to send notification' });
  }
};