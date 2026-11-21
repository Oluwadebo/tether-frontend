'use client';
import { useQuery } from '@tanstack/react-query';
import { getConversation, getConversations, getMe } from './api';

export const useMe = () => useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });

// Refreshes every 15 seconds until live updates arrive over sockets in a later step.
export const useConversations = () =>
  useQuery({ queryKey: ['conversations'], queryFn: getConversations, refetchInterval: 15_000 });

export const useConversation = (id: string) =>
  useQuery({ queryKey: ['conversation', id], queryFn: () => getConversation(id), refetchInterval: 5_000, retry: false });
