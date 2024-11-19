import { 
  createConnector,
  normalizeChainId,
} from 'wagmi'
import { type Chain } from 'wagmi/chains'
import { 
  getAddress,
  UserRejectedRequestError,
  ResourceUnavailableRpcError,
  SwitchChainError,
} from 'viem'

export type TomoConnectorOptions = {
  chains?: Chain[]
  options?: {
    shimDisconnect?: boolean
  }
}

export function tomoConnector({
  chains = [],
  options: options_ = {},
}: TomoConnectorOptions = {}) {
  const options = {
    shimDisconnect: true,
    ...options_,
  }

  type Provider = typeof window.ethereum
  type Properties = {
    onAccountsChanged(accounts: string[]): void
    onChainChanged(chainId: string): void
    onDisconnect(): void
  }

  let tomoWallet: any
  let accountsChangedListener: ((accounts: string[]) => void) | undefined
  let chainChangedListener: ((chainId: string) => void) | undefined
  let disconnectListener: (() => void) | undefined

  return createConnector<Provider, Properties>((config) => ({
    id: 'tomoWallet',
    name: 'TomoWallet',
    type: 'injected',
    
    async connect({ chainId } = {}) {
      try {
        if (!tomoWallet && typeof window !== 'undefined') {
          const { TomoWalletTgSdkV2 } = await import('@tomo-inc/tomo-telegram-sdk')
          tomoWallet = new TomoWalletTgSdkV2({ injected: true })
        }

        const provider = await this.getProvider()
        if (!provider) throw new Error('Provider not found')

        // 设置事件监听器
        if (!accountsChangedListener) {
          accountsChangedListener = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChangedListener)
        }
        if (!chainChangedListener) {
          chainChangedListener = this.onChainChanged.bind(this)
          provider.on('chainChanged', chainChangedListener)
        }
        if (!disconnectListener) {
          disconnectListener = this.onDisconnect.bind(this)
          provider.on('disconnect', disconnectListener)
        }

        try {
          const accounts = await provider.request({
            method: 'eth_requestAccounts'
          }) as string[]

          const currentChainId = await this.getChainId()

          if (chainId && currentChainId !== chainId) {
            const chain = await this.switchChain?.({ chainId })
            if (chain) {
              return {
                accounts: accounts.map(getAddress),
                chainId: chain.id
              }
            }
          }

          return {
            accounts: accounts.map(getAddress),
            chainId: currentChainId
          }
        } catch (error: any) {
          if (error.code === 4001) {
            throw new UserRejectedRequestError(error)
          }
          if (error.code === -32002) {
            throw new ResourceUnavailableRpcError(error)
          }
          throw error
        }
      } catch (error) {
        await this.disconnect()
        throw error
      }
    },

    async disconnect() {
      const provider = await this.getProvider()
      if (!provider) return

      // 移除所有事件监听器
      if (accountsChangedListener) {
        provider.removeListener('accountsChanged', accountsChangedListener)
        accountsChangedListener = undefined
      }
      if (chainChangedListener) {
        provider.removeListener('chainChanged', chainChangedListener)
        chainChangedListener = undefined
      }
      if (disconnectListener) {
        provider.removeListener('disconnect', disconnectListener)
        disconnectListener = undefined
      }
    },

    async getAccounts() {
      const provider = await this.getProvider()
      if (!provider) return []
      try {
        const accounts = await provider.request({ method: 'eth_accounts' }) as string[]
        return accounts.map(getAddress)
      } catch {
        return []
      }
    },

    async getChainId() {
      const provider = await this.getProvider()
      if (!provider) return 1 // 默认返回 mainnet chainId
      try {
        const chainId = await provider.request({ method: 'eth_chainId' }) as string
        return normalizeChainId(chainId)
      } catch {
        return 1
      }
    },

    async getProvider() {
      if (typeof window === 'undefined') return undefined
      return window.ethereum
    },

    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return accounts.length > 0
      } catch {
        return false
      }
    },

    async switchChain({ chainId }) {
      const provider = await this.getProvider()
      if (!provider) throw new Error('Provider not found')

      const chain = chains.find((x) => x.id === chainId)
      if (!chain) throw new SwitchChainError(new Error('Chain not found'))

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
        return chain
      } catch (error: any) {
        throw new SwitchChainError(error)
      }
    },

    onAccountsChanged(accounts) {
      if (accounts.length === 0) {
        this.onDisconnect()
      } else {
        config.emitter.emit('change', { 
          accounts: accounts.map(getAddress)
        })
      }
    },

    onChainChanged(chainId) {
      const id = normalizeChainId(chainId)
      config.emitter.emit('change', { chainId: id })
    },

    onDisconnect() {
      config.emitter.emit('disconnect')
    },

    async setup() {
      const provider = await this.getProvider()
      if (!provider) return

      // 设置初始事件监听器
      if (!accountsChangedListener) {
        accountsChangedListener = this.onAccountsChanged.bind(this)
        provider.on('accountsChanged', accountsChangedListener)
      }
      if (!chainChangedListener) {
        chainChangedListener = this.onChainChanged.bind(this)
        provider.on('chainChanged', chainChangedListener)
      }
      if (!disconnectListener) {
        disconnectListener = this.onDisconnect.bind(this)
        provider.on('disconnect', disconnectListener)
      }
    },
  }))
} 