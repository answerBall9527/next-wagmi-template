'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import { PaymentType } from "@/types/payment";

interface TokenOption {
  value: string
  label: React.ReactNode
  network?: string
}

type SplitType = 'evenly' | 'randomly'

const GetPaidContactPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string>('ETH')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [paymentType, setPaymentType] = useState<PaymentType>('sendToContactFromHome')
  const [splitType, setSplitType] = useState<SplitType>('evenly')
  const [recipients, setRecipients] = useState<string>('5')

  useEffect(() => {
    const type = searchParams.get('type')
    if (type && (
      type === 'sendToContactFromHome' || 
      type === 'sendToContactFromScan' || 
      type === 'external_wallet' || 
      type === 'group'
    )) {
      setPaymentType(type as PaymentType)
    }
  }, [searchParams])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTokenSelect = (value: string) => {
    setSelectedToken(value)
    setAmount('')
    setIsOpen(false)
  }

  const tokenOptions: TokenOption[] = [
    {
      value: 'ETH',
      label: (
        <div className="flex items-center gap-2">
          <Image 
            src="/images/tokens/eth.svg" 
            width={32} 
            height={32} 
            alt="ETH"
          />
          <span className="font-gilroy font-bold text-[#2A1731]">ETH</span>
        </div>
      ),
      network: 'On MegaEth Network'
    },
    {
      value: 'USDT',
      label: (
        <div className="flex items-center gap-2">
          <Image 
            src="/images/tokens/usdt.svg" 
            width={32} 
            height={32} 
            alt="USDT"
          />
          <span className="font-gilroy font-bold text-[#2A1731]">USDT</span>
        </div>
      ),
      network: 'On MegaEth Network'
    }
  ]

  const selectedTokenInfo = tokenOptions.find(token => token.value === selectedToken)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字和小数点
    if (!/^\d*\.?\d*$/.test(value)) return
    setAmount(value)
  }

  const handleShare = () => {
    // 构建预览页面的完整 URL，添加群组相关参数
    const baseUrl = 't.me/stakestone_activity_bot/getpaid'
    const previewUrl = `${baseUrl}?amount=${amount}&token=${selectedToken}&description=${encodeURIComponent(description)}${
      paymentType === 'group' 
        ? `&type=group&splitType=${splitType}&recipients=${recipients}` 
        : ''
    }`
    
    // 使用 Telegram 的分享功能
    const shareText = description || 'Buy me a Coffee! Please'
    const encodedUrl = encodeURIComponent(previewUrl)
    const encodedText = encodeURIComponent(shareText)
    
    window.Telegram?.WebApp?.openTelegramLink(
      `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}&startapp=command&mode=compact`
    )
  }

  return (
    <div className="h-full bg-white flex flex-col items-center">
      <div className="px-5 py-4 space-y-5 w-full max-w-[375px]">
        <Header title="Get Paid From a Contact" />

        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
            Pay with:
          </h2>
          <div className="mt-4 w-full rounded-[12px] border border-[#E7E4E8]">
            <div className="relative" ref={dropdownRef}>
              <div className="h-[50px] flex items-center justify-between px-3 border-b border-[#E7E4E8] rounded-t-[12px]">
                <button 
                  className="w-full h-full flex items-center"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <div className="flex items-center">
                    <Image 
                      src={`/images/tokens/${selectedToken.toLowerCase()}.svg`}
                      width={30} 
                      height={30} 
                      alt={selectedToken}
                    />
                    <span className="ml-[10px] font-gilroy font-bold text-[14px] leading-[17px] text-[#2A1731]">{selectedToken}</span>
                    <div 
                      className={`ml-[6px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '6px solid #2A1731'
                      }}
                    />
                  </div>
                </button>
              </div>

              {isOpen && (
                <div className="absolute left-0 right-0 top-[50px] bg-white w-[305px] mx-auto rounded-b-[12px] shadow-[0px_0px_30px_0px_rgba(109,86,242,0.08)]">
                  {tokenOptions.map((token) => (
                    <button
                      key={token.value}
                      className="w-full px-3 py-4 hover:bg-[#F9FAFB] transition-colors"
                      onClick={() => handleTokenSelect(token.value)}
                    >
                      <div className="flex items-start gap-[10px]">
                        <div className="w-[30px] h-[30px] relative flex-shrink-0">
                          <Image 
                            src={`/images/tokens/${token.value.toLowerCase()}.svg`}
                            fill
                            className="object-contain"
                            alt={token.value}
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-gilroy font-bold text-[14px] leading-[17px] text-[#2A1731]">{token.value}</span>
                          <span className="text-[#9D95A0] text-[14px] leading-[16px] font-gilroy font-[500]">{token.network}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
        </div>

        {paymentType === 'group' && (
          <>
            {/* Number of recipients */}
            <div>
              <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
                Number of recipients
              </h2>
              <div className="mt-4 w-full rounded-[12px] border border-[#E7E4E8] p-4">
                <input 
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="5 People"
                  className="w-full font-gilroy text-[14px] leading-[16px] bg-transparent outline-none text-[#2A1731] placeholder:text-[#9D95A0]"
                />
              </div>
            </div>

            {/* Split Payment Options */}
            <div>
              <h2 className="font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
                How do you want to split the payment?
              </h2>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setSplitType('evenly')}
                  className={`w-[160px] h-[48px] rounded-[8px] border transition-colors font-gilroy font-[500] text-[16px] leading-[19px] ${
                    splitType === 'evenly'
                      ? 'text-[#6D56F2] border-[#6D56F2]'
                      : 'bg-white text-[#9D95A0] border-[#E7E4E8]'
                  }`}
                >
                  Share Evenly
                </button>
                <button
                  onClick={() => setSplitType('randomly')}
                  className={`w-[160px] h-[48px] rounded-[8px] border transition-colors font-gilroy font-[500] text-[16px] leading-[19px] ${
                    splitType === 'randomly'
                      ? 'text-[#6D56F2] border-[#6D56F2]'
                      : 'bg-white text-[#9D95A0] border-[#E7E4E8]'
                  }`}
                >
                  Share Randomly
                </button>
              </div>
            </div>
          </>
        )}

        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
            Description:
          </h2>
          <div className="mt-[20px] w-full rounded-[12px] border border-[#E7E4E8] p-[14px]">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Buy me a Coffee! Please"
              className={`w-full h-[112px] font-gilroy font-[500] text-[14px] leading-[16px] bg-transparent outline-none resize-none ${
                description ? 'text-[#2A1731]' : 'text-[#9D95A0] placeholder:text-[#9D95A0]'
              }`}
            />
          </div>
        </div>

        <div className="bg-white px-5 pb-[31px]">
          <button 
            className="w-full h-[48px] bg-[#6D56F2] rounded-[8px] text-white font-gilroy font-[500] text-[16px] leading-[19px]"
            onClick={handleShare}
          >
            Share Link
          </button>
          <div className="mt-[10px] text-center">
            <span className="text-[#9D95A0] font-gilroy font-[500] text-[14px] leading-[16px]">
              The payment is only valid for{' '}
            </span>
            <span className="text-[#6D56F2] font-gilroy font-bold text-[14px] leading-[16px]">
              3
            </span>
            <span className="text-[#9D95A0] font-gilroy font-[500] text-[14px] leading-[16px]">
              &nbsp;days.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetPaidContactPage 