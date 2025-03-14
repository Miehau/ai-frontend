interface EchoResponse {
  message: string;
  correlationId: string | null;
  intent?: string;
  slider?: string;
}

const API_URL = 'http://localhost:3000'; // Make sure this matches your backend port

export async function sendEchoRequest(message: string, correlationId: string | null): Promise<EchoResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      correlationId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send echo request');
  }

  return await response.json();
}

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
  model: string
) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: message, conversationId, model }),
  });

  if (!response.ok) {
    console.error('Failed to send chat message:', response);
    throw new Error('Failed to send chat message');
  }

  if (response.headers.get('Content-Type')?.includes('text/event-stream')) {
    return {
      text: '',
      conversationId: null,
      stream: response.body,
    };
  } else {
    const data = await response.json();
    return { text: data.text, conversationId: data.conversationId };
  }
}

export async function createConversation(name: string) {
  const response = await fetch(`${API_URL}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return response.json();
}

export async function getConversations() {
  const response = await fetch(`${API_URL}/api/conversations`);
  return response.json();
}

export async function deleteConversation(id: string) {
  await fetch(`${API_URL}/api/conversations/${id}`, { method: 'DELETE' });
}

export async function updateConversationName(id: string, name: string) {
  const response = await fetch(`${API_URL}/api/conversations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return response.json();
}
