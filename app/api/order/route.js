import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    body.status = 'processing';

    const API_URL = process.env.NEXT_PUBLIC_WC_API_URL + '/orders';
    const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

    const response = await axios.post(
      `${API_URL}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || error.message;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 