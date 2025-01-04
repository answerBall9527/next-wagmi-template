'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    label: 'Home',
    path: '/home',
    icon: '/images/home/home.svg',
    inactiveIcon: '/images/home/home-inactive.svg'
  },
  {
    label: 'Activity',
    path: '/activity',
    icon: '/images/home/activity.svg',
    inactiveIcon: '/images/home/activity-inactive.svg'
  },
  {
    label: 'Rewards',
    path: '/rewards',
    icon: '/images/home/rewards.svg',
    inactiveIcon: '/images/home/rewards-inactive.svg'
  },
  {
    label: 'Me',
    path: '/me',
    icon: '/images/home/me.svg',
    inactiveIcon: '/images/home/me-inactive.svg'
  }
]

const BottomNav: FC = () => {
  const pathname = usePathname()
  const [viewportHeight, setViewportHeight] = useState(0)

  useEffect(() => {
    const updateViewportHeight = () => {
      // 优先使用 Telegram WebApp API 获取视口高度
      if (window.Telegram?.WebApp) {
        setViewportHeight(window.Telegram.WebApp.viewportHeight)
        // 确保 Mini App 展开
        if (!window.Telegram.WebApp.isExpanded) {
          window.Telegram.WebApp.expand()
        }
      } else {
        setViewportHeight(window.innerHeight)
      }
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
        maxHeight: viewportHeight ? `${viewportHeight - 30}px` : 'auto',
        zIndex: 50
      }}
    >
      <div className="rounded-large shadow-card w-full max-w-[345px] bg-background p-4 flex justify-around">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className="flex flex-col items-center">
              <Image 
                src={pathname === item.path ? item.icon : item.inactiveIcon} 
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