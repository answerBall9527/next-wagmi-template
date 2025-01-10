'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'

const GetPaidPage = () => {
  const router = useRouter()

  const handleRequestFromContact = () => {
    router.push('/getpaid/contact?type=requestFromContact')
  }

  const handleDisplayQR = () => {
    router.push('/getpaid/qr')
  }

  const handleReceiveDonation = () => {
    router.push('/getpaid/donation')
  }

  const handleCollectingTips = () => {
    router.push('/getpaid/tips')
  }

  return (
    <div className="h-full bg-white flex flex-col items-center">
      <div className="px-5 py-4 space-y-5 w-full max-w-[375px]">
        <Header title="Get Paid" />

        {/* Request Money from Contact */}
        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left mb-4">
            Request Money from Contact
          </h2>
          <button
            onClick={handleRequestFromContact}
            className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
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
                <div className="font-[14px] text-[#2A1731] leading-[18px] font-bold font-gilroy text-left truncate w-full">
                  Your Telegram Contact
                </div>
                <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">
                  send money by contact
                </div>
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

          <button
            onClick={handleDisplayQR}
            className="mt-3 w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image 
                  src="/images/pay/icon-external-wallet.svg" 
                  fill
                  className="object-contain"
                  alt="QR Code"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
                <div className="font-[14px] text-[#2A1731] leading-[18px] font-bold font-gilroy text-left truncate w-full">
                  Display My QR Code
                </div>
                <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">
                  Split the Bill
                </div>
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

        {/* Get Paid from Groups */}
        <div>
          <h2 className="h-[22px] font-gilroy font-bold text-[18px] text-[#2A1731] leading-[22px] text-left mb-4">
            Get Paid from Groups
          </h2>
          <button
            onClick={handleReceiveDonation}
            className="w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image 
                  src="/images/pay/icon-tipping.svg" 
                  fill
                  className="object-contain"
                  alt="Donation"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
                <div className="font-[14px] text-[#2A1731] leading-[18px] font-bold font-gilroy text-left truncate w-full">
                  Receive Donation
                </div>
                <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">
                  Tip specific person in a group
                </div>
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

          <button
            onClick={handleCollectingTips}
            className="mt-3 w-full h-[80px] rounded-[12px] border border-[#E7E4E8] flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image 
                  src="/images/pay/icon-redpocket.svg" 
                  fill
                  className="object-contain"
                  alt="Tips"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col items-start gap-[8px]">
                <div className="font-[14px] text-[#2A1731] leading-[18px] font-bold font-gilroy text-left truncate w-full">
                  Collecting Tips
                </div>
                <div className="h-[14px] text-[12px] text-[#9D95A0] leading-[14px] font-[500] font-gilroy text-left truncate w-full">
                  Collecting Tip from who opened the link
                </div>
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
    </div>
  )
}

export default GetPaidPage 