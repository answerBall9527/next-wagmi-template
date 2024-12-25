'use client'

import Image from "next/image"
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { message } from 'antd'

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

export default function ReceivePage() {
    const { address } = useAccount()
    const [copied, setCopied] = useState(false)
    const [user, setUser] = useState<TelegramUser | null>(null);

    useEffect(() => {
        const initTelegram = async () => {
            try {
                let attempts = 0;
                const maxAttempts = 10;
                
                while (!window?.Telegram?.WebApp && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    attempts++;
                }

                if (!window?.Telegram?.WebApp) {
                    console.error('Telegram WebApp not found after waiting');
                    return;
                }

                const webApp = window.Telegram.WebApp;
                const initData = webApp.initDataUnsafe;
                if (initData.user) {
                    console.log('Telegram user:', initData.user);
                    setUser(initData.user);
                }
            } catch (error) {
                console.error('Error initializing Telegram WebApp:', error);
            }
        };

        initTelegram();
    }, []);

    // 处理复制地址
    const handleCopyAddress = async () => {
        if (!address) return
        try {
            await navigator.clipboard.writeText(address)
            message.success('地址已复制')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            message.error('复制失败，请重试')
        }
    }

    // 处理保存图片
    const handleSaveImage = () => {
        // TODO: 实现保存二维码图片的逻辑 用downloadFile
        message.info('保存图片功能开发中')
    }

    // 处理扫描
    const handleScan = async () => {
        try {
            const result = await window?.Telegram?.WebApp.showScanQrPopup({
                text: "请将二维码对准扫描框"
            }, (data: string) => {
                console.log('扫描结果: ', data);
                try {
                    new URL(data);
                    window.location.href = data;
                    return true;
                } catch {
                    return false;
                }
            });
        } catch (error) {
            console.error('扫描错误:', error);
            message.error('扫描失败，请重试');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3 }}
            className="min-h-screen bg-white px-5 py-8"
        >
            {/* Header */}
            <div className="flex items-center mb-[30px]">
                <button onClick={() => window.history.back()} className="flex items-center text-black">
                    <Image 
                        src="/images/general/back.svg" 
                        width={22} 
                        height={22} 
                        alt="Back" 
                        className="mr-2"
                    />
                    <span className="text-[17px]">My QR Code</span>
                </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-start mb-[40px] items-center">
                {/* Left side - Avatar */}
                <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#F3F4F6]">
                    <Image
                        src={user?.photo_url || "https://via.placeholder.com/36x36"}
                        width={36}
                        height={36}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Right side - Name and Address */}
                <div className="flex flex-col ml-[10px]">
                    <h2 className="text-[18px] font-medium text-black mb-[2px]">
                        {user?.username ? `@${user.username}` : user?.first_name || '@User'}
                    </h2>
                    <p className="text-[#9CA3AF] text-[12px]">
                        Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                    </p>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="flex flex-col items-center mb-[60px]">
                <div className="w-[240px] h-[240px] mb-4">
                    <Image
                        src="/images/qr-placeholder.png"
                        width={240}
                        height={240}
                        alt="QR Code"
                    />
                </div>
                <p className="text-[#9CA3AF] text-[15px] text-center">
                    Scan the QR code to send me payment
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
                <button
                    onClick={handleCopyAddress}
                    className="w-full bg-[#6D56F2] text-white py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#5842d8]"
                >
                    Copy My ID
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleScan}
                        className="flex-1 border border-[#6D56F2] text-[#6D56F2] py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#6D56F2] hover:text-white"
                    >
                        Scan
                    </button>
                    <button
                        onClick={handleSaveImage}
                        className="flex-1 border border-[#6D56F2] text-[#6D56F2] py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#6D56F2] hover:text-white"
                    >
                        Save Image
                    </button>
                </div>
            </div>
        </motion.div>
    )
} 