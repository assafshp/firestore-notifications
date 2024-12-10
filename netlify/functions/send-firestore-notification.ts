import { Handler } from '@netlify/functions';
import { v4 as uuidv4 } from 'uuid';
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
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return createResponse(400, { error: 'Message is required' });
    }

    const notification = {
      id: uuidv4(),
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('notifications').add(notification);
    return createResponse(200, { success: true, notification });
  } catch (error) {
    return createResponse(500, { error: 'Failed to save notification' });
  }
};