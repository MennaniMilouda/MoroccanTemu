import { create } from 'zustand'

/** Which seller dialogs are open. Kept global so any page or header button can open them. */
interface SellerUi {
  methodsOpen: boolean
  form: { productId: string | null } | null
  openMethods: () => void
  closeMethods: () => void
  openForm: (productId?: string) => void
  closeForm: () => void
}

export const useSellerUi = create<SellerUi>()((set) => ({
  methodsOpen: false,
  form: null,
  openMethods: () => set({ methodsOpen: true }),
  closeMethods: () => set({ methodsOpen: false }),
  openForm: (productId) => set({ form: { productId: productId ?? null }, methodsOpen: false }),
  closeForm: () => set({ form: null }),
}))
