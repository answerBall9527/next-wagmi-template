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
  console.log('📦 tomoConnector 被创建', { chains: chains.map(c => c.id) });
  
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

  return createConnector<Provider, Properties>((config) => {
    console.log('🔨 createConnector 被调用');
    
    return {
      id: 'tomoWallet-tg',
      name: 'TomoWallet-tg',
      type: 'tomoWallet-tg',
      rdns: 'io.tomowallet-tg',
      
      async connect({ chainId } = {}) {
        console.log('🚀 开始连接钱包', { chainId });
        console.log('📱 Window 对象状态:', {
          hasWindow: typeof window !== 'undefined',
          hasEthereum: typeof window !== 'undefined' && !!window.ethereum,
        });
        
        try {
          if (!tomoWallet && typeof window !== 'undefined') {
            console.log('📱 初始化 TomoWallet SDK');
            const { TomoWalletTgSdkV2 } = await import('@tomo-inc/tomo-telegram-sdk')
            tomoWallet = new TomoWalletTgSdkV2({ injected: true })
            console.log('✅ TomoWallet SDK 初始化成功', tomoWallet);
          }

          const provider = await this.getProvider()
          console.log('🔌 获取到 provider:', provider);
          if (!provider) throw new Error('Provider not found')

          console.log('🎧 开始设置事件监听器');
          // 设置事件监听器
          if (!accountsChangedListener) {
            accountsChangedListener = this.onAccountsChanged.bind(this)
            provider.on('accountsChanged', accountsChangedListener)
            console.log('✅ accountsChanged 监听器设置成功');
          }
          if (!chainChangedListener) {
            chainChangedListener = this.onChainChanged.bind(this)
            provider.on('chainChanged', chainChangedListener)
            console.log('✅ chainChanged 监听器设置成功');
          }
          if (!disconnectListener) {
            disconnectListener = this.onDisconnect.bind(this)
            provider.on('disconnect', disconnectListener)
            console.log('✅ disconnect 监听器设置成功');
          }

          try {
            console.log('🔑 请求用户授权');
            const accounts = await provider.request({
              method: 'eth_requestAccounts'
            }) as string[]
            console.log('✅ 获取到账户:', accounts);

            const currentChainId = await this.getChainId()
            console.log('⛓️ 当前链 ID:', currentChainId);

            if (chainId && currentChainId !== chainId) {
              console.log('🔄 需要切换链', { 当前链: currentChainId, 目标链: chainId });
              const chain = await this.switchChain?.({ chainId })
              if (chain) {
                console.log('✅ 切换链成功', chain);
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
            console.error('❌ 连接过程出错:', error);
            if (error.code === 4001) {
              throw new UserRejectedRequestError(error)
            }
            if (error.code === -32002) {
              throw new ResourceUnavailableRpcError(error)
            }
            throw error
          }
        } catch (error) {
          console.error('❌ 连接失败:', error);
          await this.disconnect()
          throw error
        }
      },

      async disconnect() {
        console.log('🔌 开始断开连接');
        const provider = await this.getProvider()
        if (!provider) return

        console.log('🎧 移除事件监听器');
        if (accountsChangedListener) {
          provider.removeListener('accountsChanged', accountsChangedListener)
          accountsChangedListener = undefined
          console.log('✅ 移除 accountsChanged 监听器');
        }
        if (chainChangedListener) {
          provider.removeListener('chainChanged', chainChangedListener)
          chainChangedListener = undefined
          console.log('✅ 移除 chainChanged 监听器');
        }
        if (disconnectListener) {
          provider.removeListener('disconnect', disconnectListener)
          disconnectListener = undefined
          console.log('✅ 移除 disconnect 监听器');
        }
        console.log('✅ 断开连接完成');
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
        console.log('getChainId in wagmiconfig1', provider)
        if (!provider) return 1 // 默认返回 mainnet chainId
        try {
          const chainId = await provider.request({ method: 'eth_chainId' }) as string
          console.log('getChainId in wagmiconfig2', chainId)
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
        console.log('🔄 开始切换链', { chainId });
        const provider = await this.getProvider()
        if (!provider) throw new Error('Provider not found')
        
        console.log('🔍 查找链配置', { 可用链: chains, 目标链ID: chainId });
        const chain = chains.find((x) => x.id === chainId)
        if (!chain) {
          console.error('❌ 未找到链配置');
          throw new SwitchChainError(new Error('Chain not found'))
        }

        try {
          console.log('🚀 发送切换链请求', {
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }]
          });
          
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          })
          // config.emitter.emit('change', { chainId })
          console.log('✅ 切换链成功 in connector config', chain);
          return chain
        } catch (error: any) {
          console.error('❌ 切换链失败:', error);
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
    }
  })
} 