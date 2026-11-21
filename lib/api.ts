/**
 * The single door to the backend. Components never call fetch directly;
 * every request goes through request() below, and every backend action
 * gets one typed function in this file.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const TOKEN_KEY = 'tether_token';

export const token = {
  get: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  set: (value: string) => localStorage.setItem(TOKEN_KEY, value),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public field?: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const jwt = token.get();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.error ?? 'Something went wrong', body.field);
  return body as T;
}

// ---- Backend actions (added step by step) ----
export type User = { id: string; name: string; email: string; role: 'admin' | 'agent' };
type AuthResponse = { token: string; user: User };

export const health = () => request<{ ok: boolean; name: string }>('/api/health');

export async function login(email: string, password: string) {
  const data = await request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  token.set(data.token);
  return data.user;
}

export async function register(name: string, email: string, password: string) {
  const data = await request<AuthResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  token.set(data.token);
  return data.user;
}

export const getMe = () => request<{ user: User }>('/api/auth/me').then((r) => r.user);
export const logout = () => token.clear();

// ---- Conversations ----
export type Holder = 'ai' | 'human' | 'paused';
export type Contact = { id: string; name: string; company?: string; plan?: string; value?: number };
export type Conversation = {
  id: string;
  channel: 'web' | 'email' | 'whatsapp';
  topic?: string;
  status: Holder;
  confidence: number;
  control: { at: string; holder: Holder; reason?: string }[];
  lastMessageAt: string;
  lastMessagePreview?: string;
  contact: Contact | null;
};

export const getConversations = () =>
  request<{ conversations: Conversation[] }>('/api/conversations').then((r) => r.conversations);

export type Message = {
  id: string;
  conversation: string;
  from: 'customer' | 'ai' | 'agent';
  text: string;
  confidence?: number;
  createdAt: string;
};

export const getConversation = (id: string) =>
  request<{ conversation: Conversation; messages: Message[] }>(`/api/conversations/${id}`);

export const sendMessage = (id: string, text: string) =>
  request<{ message: Message }>(`/api/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify({ text }) })
    .then((r) => r.message);

export const setControl = (id: string, holder: Holder) =>
  request<{ conversation: Conversation }>(`/api/conversations/${id}/control`, { method: 'POST', body: JSON.stringify({ holder }) })
    .then((r) => r.conversation);

// ---- Demo helpers ----
export const simulateCustomer = (id: string, text?: string) =>
  request<{ message: Message }>(`/api/conversations/${id}/simulate`, { method: 'POST', body: JSON.stringify({ text }) })
    .then((r) => r.message);

export const resetDemo = () => request<{ ok: boolean }>('/api/demo/reset', { method: 'POST' });
