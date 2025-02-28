'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useConnect, useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { useGlobalStore } from '@/store'
import { motion } from 'framer-motion'
import Header from '@/components/Header'

const detailText = 'By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use. By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use. By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.'

const LoginPage = () => {
  const { isConnected } = useAccount()
  const [showTerms, setShowTerms] = useState(false)
  const { connectors, connectAsync } = useConnect()
  const router = useRouter()
  
  const { isTermsAgreed, setTermsAgreed, setWalletConnected } = useGlobalStore()

  const handleConnect = async () => {
    if (!isTermsAgreed) {
      message.warning('请先同意服务条款')
      return
    }
    try {
      // TODO tomo tg wallet不可用了，所以这里hardcode成true，等接了新钱包再去掉
      setWalletConnected(true)
      // TODO 这块无法正确判断出来链接是否成功
      // await connectAsync({ connector: connectors[0] })
      message.success('钱包连接成功')
      setWalletConnected(true)
      router.push('/home')
    } catch (error) {
      message.error('钱包连接失败，请重试')
      console.error('连接失败:', error)
    }
  }

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-[375px] mx-auto bg-white h-screen flex flex-col">
        <Header 
          title="Back"
          onClose={() => setShowTerms(false)} 
        />

        <h1 className="text-center text-2xl font-bold mb-6">
          Term of Use
        </h1>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pb-[80px]">
            <p className="text-[#867B8A] text-center leading-[1.6]">
              {detailText}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="h-[100vh] w-[100vw] bg-white px-5 py-[120px] flex flex-col items-center overflow-hidden">
        {/* Logo 部分 */}
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.svg"
            alt="Pebbles Logo"
            width={170}
            height={143}
            priority
            className="mb-[25px]"
          />
          {/* <h1 className="text-[34px] font-bold mb-[41px] leading-none">
            Pebbles
          </h1> */}
          <p className="text-[#9CA3AF] text-[19px]">
            Smart Saving among Friends
          </p>
        </div>

        {/* 底部按钮区域 */}
        <div className="w-full mt-[325px] space-y-5">
          <button 
            className="w-full bg-[#6D56F2] text-white py-[15px] rounded-lg text-base font-medium whitespace-nowrap font-['Gilroy-Medium']"
            onClick={handleConnect}
          >
            Connect Wallet To Start
          </button>
          
          <div className="flex items-center justify-center gap-2">
            <input 
              type="checkbox" 
              id="terms" 
              checked={isTermsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="relative w-[14px] h-[14px] mt-0.5 rounded-full appearance-none border border-[#6A5CFE] checked:bg-[#6A5CFE] cursor-pointer transition-colors checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-[10px] checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2"
            />
            <span 
              className="text-[#867B8A] text-[15px] font-bold leading-[18px] font-['Gilroy-Bold'] cursor-pointer"
              onClick={() => setShowTerms(true)}
            >
              Term of Use
            </span>
          </div>
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-[100vw] h-[100vh] bg-white flex flex-col">
              {/* {detailText} */}
              <TermsModal />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LoginPage 