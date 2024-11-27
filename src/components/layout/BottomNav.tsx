'use client'
import { FC } from 'react'
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

  return (
    <div className="flex justify-center">
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