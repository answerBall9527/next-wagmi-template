'use client'

import Image from 'next/image'

interface HeaderProps {
  title: string;
  onClose?: () => void;
}

const Header = ({ 
  title, 
  onClose 
}: HeaderProps) => {
  const handleClick = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex items-center mb-[30px]">
      <button onClick={handleClick} className="flex items-center text-black">
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