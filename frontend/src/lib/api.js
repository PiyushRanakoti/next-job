import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

function getToken() {
  return localStorage.getItem('nextjob_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}/api` + path, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...(options.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export function useJobs() {
  return useQuery({ queryKey: ['jobs'], queryFn: () => apiFetch('/jobs') });
}

export function useJob(id) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => apiFetch(`/jobs/${id}`),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiFetch('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => apiFetch(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiFetch(`/jobs/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: (data) => apiFetch('/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  });
}

export function useSubscribers() {
  return useQuery({ queryKey: ['subscribers'], queryFn: () => apiFetch('/subscribers') });
}

export function useDeleteSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiFetch(`/subscribers/${id}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscribers'] }),
  });
}

export function useAdminStats() {
  return useQuery({ queryKey: ['admin-stats'], queryFn: () => apiFetch('/admin/stats') });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data) => apiFetch('/admin/login', { method: 'POST', body: JSON.stringify(data) }),
  });
}

export function useTrackVisit(path) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    fetch(`${BASE_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch(() => { });
  }, [path]);
}
