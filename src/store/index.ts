import { create } from 'zustand'

interface GlobalState {
  isTermsAgreed: boolean
  setTermsAgreed: (agreed: boolean) => void
  isWalletConnected: boolean
  setWalletConnected: (connected: boolean) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // Terms 相关状态
  isTermsAgreed: false,
  setTermsAgreed: (agreed) => set({ isTermsAgreed: agreed }),
  
  // 钱包连接状态
  isWalletConnected: false,
  setWalletConnected: (connected) => set({ isWalletConnected: connected }),
})) 