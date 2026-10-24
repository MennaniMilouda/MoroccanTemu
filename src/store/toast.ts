import { create } from 'zustand'

export type ToastKind = 'success' | 'error' | 'info'
export interface Toast { id: number; message: string; kind: ToastKind; action?: { label: string; run: () => void } }

interface ToastState {
  toasts: Toast[]
  push: (message: string, kind?: ToastKind, action?: Toast['action']) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (message, kind = 'success', action) => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, kind, action }] }))
    setTimeout(() => get().dismiss(id), action ? 5000 : 3200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, kind?: ToastKind, action?: Toast['action']) =>
  useToasts.getState().push(message, kind, action)
