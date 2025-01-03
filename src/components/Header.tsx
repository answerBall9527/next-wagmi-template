'use client'

import Image from 'next/image'

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex items-center mb-[30px]">
      <button onClick={() => window.history.back()} className="flex items-center text-black">
        <Image 
          src="/images/general/back.svg" 
          width={22} 
          height={22} 
          alt="Back" 
          className="mr-2"
        />
        <span className="text-[17px]">{title}</span>
      </button>
    </div>
  )
}

export default Header 