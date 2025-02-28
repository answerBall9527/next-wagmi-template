'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useMemo } from 'react'

type TabType = 'All' | 'Transaction' | 'Deposit' | 'Withdraw'
type TransactionType = 'send' | 'receive' | 'deposit' | 'withdraw' | 'group'

interface Transaction {
    type: TransactionType
    to?: string
    from?: string
    time: string
    amount: string
    avatar?: string
    icon?: string
    action?: string
}

export default function RewardsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('All')
    const [searchQuery, setSearchQuery] = useState('')

    const tabs: TabType[] = ['All', 'Transaction', 'Deposit', 'Withdraw']

    const transactions: Transaction[] = [
        {
            type: 'send',
            to: '@Jimmy',
            time: 'Today 07:33',
            amount: '5 ETH',
            // avatar: 'https://via.placeholder.com/36x36'
        },
        {
            type: 'send',
            to: '@ETHjimmy',
            time: 'Today 07:33',
            amount: '5 USDT',
            // avatar: 'https://via.placeholder.com/36x36'
        },
        {
            type: 'receive',
            from: '@Charles',
            time: 'Yesterday 07:33',
            amount: '10.5 USDT',
            // avatar: 'https://via.placeholder.com/36x36'
        },
        {
            type: 'receive',
            from: '@Sue',
            time: 'Yesterday 07:33',
            amount: '10.5 USDT',
            // avatar: 'https://via.placeholder.com/36x36'
        },
        {
            type: 'deposit',
            time: '2024-10-2 07:33',
            amount: '22131 USDT',
            // icon: '/images/tether.svg'
        },
        {
            type: 'group',
            action: 'Send as group payment',
            time: 'Today 07:33',
            amount: '15 USDT'
        },
        {
            type: 'group',
            action: 'Get Paid from group',
            time: 'Today 07:33',
            amount: '15 USDT'
        },
        {
            type: 'group',
            action: 'Send as group payment',
            time: 'Today 07:33',
            amount: '15 USDT'
        }
    ]

    const hasTransactions = transactions.length > 0

    // const hasTransactions = false

    // 更新 filteredTransactions 的逻辑
    const filteredTransactions = useMemo(() => {
        let filtered = transactions;
        
        // 首先根据 tab 筛选
        switch (activeTab) {
            case 'Transaction':
                filtered = filtered.filter(t => t.type === 'send' || t.type === 'receive')
                break
            case 'Deposit':
                filtered = filtered.filter(t => t.type === 'deposit')
                break
            case 'Withdraw':
                filtered = filtered.filter(t => t.type === 'withdraw')
                break
        }
        
        // 如果有搜索关键词，进行搜索过滤
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter(transaction => {
                // 搜索币种（所有交易类型都适用）
                if (transaction.amount.toLowerCase().includes(query)) {
                    return true
                }

                // 对于 send 和 receive 类型的交易，搜索 from 和 to
                if (transaction.type === 'send' || transaction.type === 'receive') {
                    return (
                        (transaction.to?.toLowerCase().includes(query) || false) ||
                        (transaction.from?.toLowerCase().includes(query) || false)
                    )
                }

                return false
            })
        }

        return filtered
    }, [activeTab, transactions, searchQuery])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white px-5"
        >
            {hasTransactions ? (
                <div className="pt-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Image 
                                src="/images/search.svg" 
                                width={20} 
                                height={20} 
                                alt="Search"
                            />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for Transaction by details"
                            className="w-full h-[46px] bg-[#F2F2F2] rounded-[10px] pl-12 pr-4 text-[15px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D56F2]/20"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-[12px] py-[5px] rounded-[4px] whitespace-nowrap text-[12px] font-medium transition-colors
                                    ${activeTab === tab 
                                        ? 'bg-[#6D56F2] text-white' 
                                        : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {transaction.type === 'group' ? (
                                        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
                                            <Image 
                                                src="/images/activity/group-icon.svg" 
                                                width={36} 
                                                height={36} 
                                                alt="Group" 
                                            />
                                        </div>
                                    ) : transaction.type === 'deposit' ? (
                                        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center">
                                            <Image 
                                                src={transaction.icon || '/images/activity/vault-icon.svg'} 
                                                width={36} 
                                                height={36} 
                                                alt="Token" 
                                            />
                                        </div>
                                    ) : (transaction.type === 'send' || transaction.type === 'receive') && (
                                        <Image 
                                            src={transaction.avatar || '/images/activity/transaction-icon.svg'} 
                                            width={36} 
                                            height={36} 
                                            alt="Avatar" 
                                            className="rounded-full"
                                        />
                                    )}
                                    <div className="ml-3">
                                        <p className="text-[15px] text-black font-medium">
                                            {transaction.type === 'send' ? `To ${transaction.to}` :
                                             transaction.type === 'receive' ? `${transaction.from} to you` :
                                             transaction.type === 'deposit' ? 'Deposit in USDT' :
                                             transaction.action}
                                        </p>
                                        <p className="text-[12px] text-[#9CA3AF]">{transaction.time}</p>
                                    </div>
                                </div>
                                <span className="text-[15px] font-medium text-black">
                                    {transaction.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center -mt-[100px]">
                        <Image 
                            src="/images/empty-state.svg" 
                            width={150} 
                            height={150} 
                            alt="No Transactions" 
                        />
                        <p className="text-black text-[18px] font-bold mt-4">
                            No Transaction Yet
                        </p>
                        <p className="text-[#9CA3AF] text-[15px]">
                            All your transactions will be here
                        </p>
                        <button className="mt-6 bg-[#6D56F2] text-white py-2 px-6 rounded-lg text-base font-medium">
                            Explore
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    )
} 