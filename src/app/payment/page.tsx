'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'

const PaymentPage = () => {
  const router = useRouter()

  const handleGroupPayment = () => {
    router.push('/payment/contact?type=group')
  }

  const handleExternalWallet = () => {
    router.push('/payment/contact?type=external_wallet')
  }

  return (
    <div className="h-full bg-white flex flex-col items-center">
      <div className="px-5 py-4 space-y-5 w-full max-w-[375px]">
        <Header title="Pay" />

        <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">
          Pay to a Contact
        </h2>

        {/* Telegram Contact Option */}
        <button 
          className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
          onClick={() => router.push('/payment/contact')}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image 
                src="/images/pay/icon-contact.svg" 
                fill
                className="object-contain"
                alt="contact icon"
              />
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
              <div className="font-[14px] text-[#2A1731] leading-[17px] font-bold font-gilroy text-left truncate w-full">Your Telegram Contact</div>
              <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">send money by contact</div>
            </div>
          </div>
          <Image 
            src="/images/arrow-right.svg" 
            width={10} 
            height={10} 
            alt="arrow right"
            className="flex-shrink-0 ml-2"
          />
        </button>

        {/* External Wallet Option */}
        <button 
          onClick={handleExternalWallet}
          className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image 
                src="/images/pay/icon-external-wallet.svg" 
                fill
                className="object-contain"
                alt="external wallet icon"
              />
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
              <div className="font-[14px] text-[#2A1731] leading-[17px] font-bold font-gilroy text-left truncate w-full">External Wallet</div>
              <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">Enter a phone number to Pay</div>
            </div>
          </div>
          <Image 
            src="/images/arrow-right.svg" 
            width={10} 
            height={10} 
            alt="arrow right"
            className="flex-shrink-0 ml-2"
          />
        </button>

        <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left">Pay to Group</h2>

        {/* Tipping Option */}
        <button 
          onClick={handleGroupPayment}
          className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image 
                src="/images/pay/icon-tipping.svg" 
                fill
                className="object-contain"
                alt="tipping icon"
              />
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
              <div className="font-[14px] text-[#2A1731] leading-[17px] font-bold font-gilroy text-left truncate w-full">Tipping</div>
              <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">Tip to specific person</div>
            </div>
          </div>
          <Image 
            src="/images/arrow-right.svg" 
            width={10} 
            height={10} 
            alt="arrow right"
            className="flex-shrink-0 ml-2"
          />
        </button>

        {/* Airdrop Option */}
        <button 
          onClick={handleGroupPayment}
          className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image 
                src="/images/pay/icon-airdrop.svg" 
                fill
                className="object-contain"
                alt="airdrop icon"
              />
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
              <div className="font-[14px] text-[#2A1731] leading-[17px] font-bold font-gilroy text-left truncate w-full">Airdrop</div>
              <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">Anyone with the link will get portion of the payment</div>
            </div>
          </div>
          <Image 
            src="/images/arrow-right.svg" 
            width={10} 
            height={10} 
            alt="arrow right"
            className="flex-shrink-0 ml-2"
          />
        </button>

        {/* Red Pocket Option */}
        <button 
          onClick={handleGroupPayment}
          className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image 
                src="/images/pay/icon-redpocket.svg" 
                fill
                className="object-contain"
                alt="red pocket icon"
              />
            </div>
            <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
              <div className="font-[14px] text-[#2A1731] leading-[17px] font-bold font-gilroy text-left truncate w-full">Red Pocket</div>
              <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">Group Members can claim the payment</div>
            </div>
          </div>
          <Image 
            src="/images/arrow-right.svg" 
            width={10} 
            height={10} 
            alt="arrow right"
            className="flex-shrink-0 ml-2"
          />
        </button>
      </div>
    </div>
  )
}

export default PaymentPage 