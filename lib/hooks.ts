'use client';
import { useQuery } from '@tanstack/react-query';
import { getConversation, getConversations, getMe } from './api';

export const useMe = () => useQuery({ queryKey: ['me'], queryFn: getMe, retry: false });

// Live updates arrive over the socket; this slow refresh is only a safety net.
export const useConversations = () =>
  useQuery({ queryKey: ['conversations'], queryFn: getConversations, refetchInterval: 60_000 });

export const useConversation = (id: string) =>
  useQuery({ queryKey: ['conversation', id], queryFn: () => getConversation(id), refetchInterval: 60_000, retry: false });
