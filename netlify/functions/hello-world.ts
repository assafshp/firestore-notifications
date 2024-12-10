import { Handler } from '@netlify/functions';
import { handleCors } from './utils/cors';
import { createResponse } from './utils/response';

export const handler: Handler = async (event) => {
  const corsResponse = await handleCors(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    return createResponse(200, { hello: message });
  } catch (error) {
    return createResponse(400, { error: 'Invalid request body' });
  }
};