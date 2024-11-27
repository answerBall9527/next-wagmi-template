'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import icon42 from '@/assets/42x42.png'

const navItems = [
  {
    label: 'Home',
    path: '/home',
    icon: icon42
  },
  {
    label: 'Activity',
    path: '/activity',
    icon: icon42
  },
  {
    label: 'Rewards',
    path: '/rewards',
    icon: icon42
  },
  {
    label: 'Me',
    path: '/me',
    icon: icon42
  }
]

const BottomNav: FC = () => {
  const pathname = usePathname()
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    // 获取实际视口高度
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)

    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  return (
    <div 
      className="fixed left-0 right-0 flex justify-center"
      style={{ 
        bottom: '30px',
        // 确保不会超出实际视口
        maxHeight: viewportHeight ? `${viewportHeight - 30}px` : 'auto'
      }}
    >
      <div className="rounded-large shadow-card w-full max-w-[345px] bg-background p-4 flex justify-around">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="flex flex-col items-center">
              <Image 
                src={item.icon} 
                width={24} 
                height={24} 
                alt={item.label} 
              />
              <span className={`text-xs mt-2 ${pathname === item.path ? 'text-secondary font-bold' : 'text-secondary'}`}>
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BottomNav 