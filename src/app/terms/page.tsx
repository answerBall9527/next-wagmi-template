'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const TermsPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full max-w-[375px] mx-auto bg-white px-5 py-6">
      {/* 头部返回按钮 */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-black"
        >
          <span className="text-2xl mr-2">←</span>
          <span className="text-base">Back</span>
        </button>
      </div>

      {/* 标题 */}
      <h1 className="text-center text-2xl font-bold mb-6">
        Term of Use
      </h1>

      {/* 内容 */}
      <p className="text-[#867B8A] text-center leading-[1.6]">
        By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use. By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use. By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.By checking the box, you confirm that you have read and agreed to the Terms of Use. Please click on the link to view the detailed Terms of Use.
      </p>
    </div>
  )
}

export default TermsPage 