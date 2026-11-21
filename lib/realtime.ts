'use client';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Conversation, Message } from './api';
import { disconnectSocket, getSocket } from './socket';

type Detail = { conversation: Conversation; messages: Message[] };
const byNewest = (a: Conversation, b: Conversation) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt);

/** Listens to the server and writes every change straight into the query cache, so screens update instantly. */
export function useRealtime(enabled: boolean) {
  const queryClient = useQueryClient();
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const socket = getSocket();

    const onConnect = () => {
      setLive(true);
      // Catch up on anything missed while offline.
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation'] });
    };
    const onDisconnect = () => setLive(false);
    const onMessage = ({ conversationId, message }: { conversationId: string; message: Message }) => {
      queryClient.setQueryData<Detail>(['conversation', conversationId], (old) =>
        old && !old.messages.some((m) => m.id === message.id) ? { ...old, messages: [...old.messages, message] } : old);
    };
    const onConversation = ({ conversation }: { conversation: Conversation }) => {
      queryClient.setQueryData<Detail>(['conversation', conversation.id], (old) => (old ? { ...old, conversation } : old));
      queryClient.setQueryData<Conversation[]>(['conversations'], (old) => {
        if (!old) return old;
        const next = old.some((c) => c.id === conversation.id) ? old.map((c) => (c.id === conversation.id ? conversation : c)) : [conversation, ...old];
        return next.sort(byNewest);
      });
    };
    const onTyping = ({ conversationId, on }: { conversationId: string; on: boolean }) =>
      queryClient.setQueryData<Record<string, boolean>>(['typing'], (old) => ({ ...(old ?? {}), [conversationId]: on }));
    const onReset = () => queryClient.invalidateQueries();

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);
    socket.on('conversation', onConversation);
    socket.on('typing', onTyping);
    socket.on('reset', onReset);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
      socket.off('conversation', onConversation);
      socket.off('typing', onTyping);
      socket.off('reset', onReset);
      disconnectSocket();
      setLive(false);
    };
  }, [enabled, queryClient]);

  return { live };
}

/** True while the AI is writing a reply in this conversation. */
export function useTyping(conversationId: string): boolean {
  const { data } = useQuery<Record<string, boolean>>({ queryKey: ['typing'], queryFn: () => ({}), staleTime: Infinity, initialData: {} });
  return data[conversationId] ?? false;
}
