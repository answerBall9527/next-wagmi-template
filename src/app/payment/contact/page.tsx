'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'

interface TokenOption {
  value: string
  label: React.ReactNode
  balance: string
  network?: string
}

interface ReceiverInfo {
  id: string
  username: string
  photoUrl: string
}

type PaymentType = 'sendToContactFromHome' | 'sendToContectFromScan'

const PaymentContactPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string>('USDT')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [receiver, setReceiver] = useState<ReceiverInfo | null>(null)
  const [paymentType, setPaymentType] = useState<PaymentType>('sendToContactFromHome')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const type = searchParams.get('type') as PaymentType
    if (type) {
      setPaymentType(type)
    }

    // 只有在 sendToContectFromScan 类型时才初始化接收人信息
    if (type === 'sendToContectFromScan') {
      const initReceiver = () => {
        const receiverId = searchParams.get('receiverId')
        const receiverName = searchParams.get('receiverName')
        
        if (receiverId && receiverName) {
          setReceiver({
            id: receiverId,
            username: receiverName,
            photoUrl: '/images/avatar-placeholder.svg'
          })
        } else {
          // 如果是 scan 类型但没有接收人信息，可能需要返回上一页
          router.back()
        }
      }

      initReceiver()
    }
  }, [searchParams, router])

  const handleTokenSelect = (value: string) => {
    setSelectedToken(value)
    setAmount('')
    setIsOpen(false)
  }

  const tokenOptions: TokenOption[] = [
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
      balance: '55.38',
      network: 'On MegaEth Network'
    },
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
      balance: '0.0',
      network: 'On MegaEth Network'
    }
  ]

  const selectedTokenInfo = tokenOptions.find(token => token.value === selectedToken)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字和小数点
    if (!/^\d*\.?\d*$/.test(value)) return

    // 如果输入的数值大于余额，则不更新
    const numValue = parseFloat(value || '0')
    const balance = parseFloat(selectedTokenInfo?.balance || '0')
    
    if (numValue <= balance) {
      setAmount(value)
    }
  }

  const handleShare = () => {
    const shareUrl = 't.me/stakestone_activity_bot/redpacket'
    const shareText = description || 'Best wishes to your friend!' // 如果没有描述，使用默认文本
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent(shareText)
    
    window.Telegram.WebApp.openTelegramLink(
      `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}&startapp=command&mode=compact`
    )
  }

  return (
    <div className="h-full bg-white flex flex-col items-center">
      <div className="px-5 py-4 space-y-5 w-full max-w-[375px]">
        <Header title="Pay to a Contact" />
        
        {/* Receiver Info - 只在 sendToContectFromScan 类型时显示 */}
        {paymentType === 'sendToContectFromScan' && receiver && (
          <div>
            <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
              Pay to:
            </h2>
            <div className="mt-4 flex items-center">
              <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#F3F4F6]">
                <Image
                  src={receiver.photoUrl}
                  width={36}
                  height={36}
                  alt="Receiver"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-[18px] font-gilroy font-bold text-[#2A1731]">
                  @{receiver.username}
                </span>
                <span className="text-[14px] font-gilroy text-[#9D95A0]">
                  {receiver.id}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
            Pay with:
          </h2>
          <div className="mt-4 w-full rounded-[12px] border border-[#E7E4E8]">
            <div className="relative" ref={dropdownRef}>
              <div className="h-[50px] flex items-center justify-between px-3 border-b border-[#E7E4E8] rounded-t-[12px]">
                <button 
                  className="w-full h-full flex items-center justify-between"
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
                  <div className="flex items-center text-[14px] leading-[16px]">
                    <span className="text-[#9D95A0] font-gilroy font-[500]">Balance: </span>
                    <span className="text-[#2A1731] font-gilroy font-bold ml-[4px]">{selectedTokenInfo?.balance}</span>
                    <span className="text-[#9D95A0] font-gilroy font-[500] ml-[4px]">{selectedToken}</span>
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

        {/* Description section */}
        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
            Description:
          </h2>
          <div className="mt-[20px] w-full rounded-[12px] border border-[#E7E4E8] p-[14px]">
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Best wishes to your friend!"
              className={`w-full h-[112px] font-gilroy font-[500] text-[14px] leading-[16px] bg-transparent outline-none resize-none ${
                description ? 'text-[#2A1731]' : 'text-[#9D95A0] placeholder:text-[#9D95A0]'
              }`}
            />
          </div>
        </div>

        {/* Pay button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 pb-[31px]">
          <button 
            className="w-full h-[48px] bg-[#6D56F2] rounded-[8px] text-white font-gilroy font-[500] text-[16px] leading-[19px]"
            onClick={handleShare}
          >
            Pay to a Contact
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

export default PaymentContactPage 