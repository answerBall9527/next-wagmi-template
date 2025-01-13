'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface DonationRecord {
  username: string
  time: string
  amount: string
  avatar?: string
}

const PreviewPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 状态管理
  const [params, setParams] = useState({
    isGroupPayment: false,
    splitType: '',
    token: 'USDT',
    amount: '',
    description: '',
    sender: '',
    txid: '',
    isParamsSet: false
  })

  useEffect(() => {
    // 如果参数已经通过Telegram设置，则不再处理
    if (params.isParamsSet) return;

    const initTelegram = async () => {
      try {
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!window?.Telegram?.WebApp && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }

        if (!window?.Telegram?.WebApp) {
          console.error('Telegram WebApp not found after waiting');
          return;
        }

        const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
        if (startParam) {
          try {
            // 解析Telegram参数
            const telegramParams = startParam.split('-').reduce((acc, curr) => {
              const [key, value] = curr.split('=');
              acc[key] = value;
              return acc;
            }, {} as Record<string, string>);

            // 如果成功获取到Telegram参数，设置参数并标记为已设置
            if (Object.keys(telegramParams).length > 0) {
              setParams(prev => ({
                ...prev,
                isGroupPayment: telegramParams.type === 'group',
                splitType: telegramParams.splitType || '',
                token: telegramParams.token || 'USDT',
                amount: telegramParams.amount || '',
                description: decodeURIComponent(telegramParams.description || ''),
                sender: telegramParams.sender || '',
                txid: telegramParams.txid || '',
                isParamsSet: true
              }));
              return;  // 成功设置后直接返回，不再处理URL参数
            }
          } catch (e) {
            console.log('Failed to parse Telegram params, falling back to URL params');
          }
        }

        // 如果没有成功设置Telegram参数，则使用URL参数
        const urlType = searchParams.get('type');
        const urlSplitType = searchParams.get('splitType');
        const urlToken = searchParams.get('token');
        const urlAmount = searchParams.get('amount');
        const urlDescription = searchParams.get('description');
        const urlSender = searchParams.get('sender');
        const urlTxid = searchParams.get('txid');

        if (urlType || urlSplitType || urlToken || urlAmount || urlDescription || urlSender || urlTxid) {
          setParams(prev => ({
            ...prev,
            isGroupPayment: urlType === 'group',
            splitType: urlSplitType || '',
            token: urlToken || 'USDT',
            amount: urlAmount || '',
            description: urlDescription || '',
            sender: urlSender || '',
            txid: urlTxid || '',
            isParamsSet: true
          }));
        }
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
      }
    };

    initTelegram();
  }, [searchParams, params.isParamsSet]);  // 添加 isParamsSet 到依赖数组

  const { isGroupPayment, splitType, token, amount: initialAmount, description } = params;
  const [amount, setAmount] = useState(initialAmount);

  // 模拟的捐赠记录数据
  const donationRecords: DonationRecord[] = [
    {
      username: 'Shrimpgump',
      time: 'Today 07:33',
      amount: '5 USDT'
    },
    {
      username: 'BeeBee',
      time: 'Today 07:33',
      amount: '5 USDT'
    },
    {
      username: 'sunshaine',
      time: '2024-09-06 13:21',
      amount: '5 USDT'
    }
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!/^\d*\.?\d*$/.test(value)) return
    setAmount(value)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header */}
      <div className="h-[56px] flex items-center justify-center border-b border-[#E7E4E8]">
        <h1 className="text-[18px] font-medium text-[#2A1731]">Pay For</h1>
      </div>

      <div className="w-full flex flex-col px-5">
        {/* User Info */}
        <div className="pt-[30px]">
          <div className="flex items-center mb-[40px]">
            {/* Left side - Avatar */}
            <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#F3F4F6]">
              <Image
                src="/images/pay/icon-contact.svg"
                width={36}
                height={36}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Right side - Name and Address */}
            <div className="flex flex-col ml-[10px]">
              <h2 className="text-[18px] font-medium text-black mb-[2px]">
                @Tristan
              </h2>
              <p className="text-[#9CA3AF] text-[12px]">
                tristan@stakestone.io
              </p>
            </div>
          </div>
        </div>

        {/* Amount Input - Only show for random split type */}
        {splitType === 'randomly' ? (
          <div>
            <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
              Pay with:
            </h2>
            <div className="mt-4 w-full rounded-[12px] border border-[#E7E4E8]">
              <div className="relative">
                <div className="h-[50px] flex items-center justify-between px-3 border-b border-[#E7E4E8] rounded-t-[12px]">
                  <div className="flex items-center">
                    <Image 
                      src={`/images/tokens/${token.toLowerCase()}.svg`}
                      width={30} 
                      height={30} 
                      alt={token}
                    />
                    <span className="ml-[10px] font-gilroy font-bold text-[14px] leading-[17px] text-[#2A1731]">{token}</span>
                  </div>
                  <div className="flex items-center text-[14px] leading-[16px]">
                    <span className="text-[#9D95A0] font-gilroy font-[500]">Available Balance: </span>
                    <span className="text-[#2A1731] font-gilroy font-bold ml-[4px]">397655.38</span>
                    <span className="text-[#9D95A0] font-gilroy font-[500] ml-[4px]">{token}</span>
                  </div>
                </div>
              </div>

              <div className="h-[79px] flex items-center px-[14px] rounded-b-[12px]">
                <input 
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Enter Amount"
                  className={`w-full text-right font-gilroy font-bold text-[16px] leading-[19px] bg-transparent outline-none ${
                    amount ? 'text-[#2A1731]' : 'text-[#9D95A0] placeholder:text-[#9D95A0]'
                  }`}
                />
              </div>
            </div>
            <p className="mt-2 text-center text-[#9D95A0] font-gilroy text-[14px]">
              To help stop the climate change
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-center">
              <span className="font-[Gilroy-Bold] text-[36px] leading-[43px] text-[#2A1731] text-center">5</span>
              <span className="font-[Gilroy] text-[14px] leading-[43px] text-[#867B8A] ml-2">USDT</span>
            </div>
            <p className="h-[14px] font-[Gilroy] text-[12px] leading-[14px] text-[#6D56F2] text-center font-normal">
              It has been saved into your balance
            </p>
          </div>
        )}

        {/* Donation Records - Only show for group payment */}
        {isGroupPayment && (
          <div className="mt-8">
            <h2 className="text-[18px] font-medium text-[#2A1731] mb-4">
              Members who already donated
            </h2>
            <div className="space-y-4">
              {donationRecords.map((record, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-[#F3F4F6]">
                      <Image
                        src={record.avatar || "/images/pay/icon-contact.svg"}
                        width={40}
                        height={40}
                        alt={record.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-[16px] font-medium text-[#2A1731]">
                        @{record.username}
                      </div>
                      <div className="text-[14px] text-[#9D95A0]">
                        {record.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-[16px] font-medium text-[#2A1731]">
                    {record.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pay Button */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white">
          <button 
            className="w-full h-[48px] bg-[#6D56F2] rounded-[8px] text-white font-gilroy font-[500] text-[16px] leading-[19px]"
            onClick={() => alert('Pay')}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewPage 