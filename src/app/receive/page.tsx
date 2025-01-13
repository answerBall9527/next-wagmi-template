'use client'

import Image from "next/image"
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { message } from 'antd'
import QRCode from 'qrcode'
import Header from '@/components/Header'

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
    const [qrCodeSvg, setQrCodeSvg] = useState<string>('')

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
                console.log('999before query user', user)
                if (initData.user) {
                    console.log('999Telegram user:', initData.user);
                    setUser(initData.user);
                }
            } catch (error) {
                console.error('Error initializing Telegram WebApp:', error);
            }
        };

        initTelegram();
    }, []);

    // 生成二维码
    useEffect(() => {
        if (user) {
            // 构建支付链接
            const paymentUrl = new URL('/payment/contact', window.location.origin)
            paymentUrl.searchParams.set('type', 'sendToContactFromScan')
            paymentUrl.searchParams.set('receiverId', user.id.toString())
            paymentUrl.searchParams.set('receiverName', user.username || user.first_name)
            console.log('paymentUrl', paymentUrl)
            QRCode.toString(paymentUrl.toString(), {
                type: 'svg',
                margin: 1,
                width: 240,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (err, string) => {
                if (err) {
                    console.error('生成二维码失败:', err)
                    return
                }
                setQrCodeSvg(string)
            })
        }
    }, [user])

    // 处理复制地址
    const handleCopyLink = async () => {
        if (!user) return
        try {
            const paymentUrl = new URL('/payment/contact', window.location.origin)
            paymentUrl.searchParams.set('type', 'sendToContactFromScan')
            paymentUrl.searchParams.set('receiverId', user.id.toString())
            paymentUrl.searchParams.set('receiverName', user.username || user.first_name)

            await navigator.clipboard.writeText(paymentUrl.toString())
            message.success('链接已复制')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            message.error('复制失败，请重试')
        }
    }

    // 处理保存图片
    const handleSaveImage = () => {
        // TODO: 实现保存二维码图片的逻辑 用 downloadFile
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

    // 处理分享
    const handleShare = () => {
        if (!user) return

        const paymentUrl = `t.me/stakestone_activity_bot/pay2contact?startapp=type=sendToContactFromScan-receiverId=${user.id}-recerverName=${user.username}`

        const shareText = 'Send me payment via StakeStone' // 可以根据需要修改分享文本
        const encodedText = encodeURIComponent(shareText)
        
        window.Telegram.WebApp.openTelegramLink(
            `https://t.me/share/url?url=${paymentUrl}&text=${encodedText}&startapp=command&mode=compact`
        )
    }

    return (
        <div className="h-full bg-white flex flex-col items-center">
            <div className="px-5 py-4 space-y-5 w-full max-w-[375px]">
                <Header title="My QR Code" />
                {/* Profile Section */}
                <div className="flex items-start mb-[40px] items-center">
                    {/* Left side - Avatar */}
                    <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#F3F4F6]">
                        <Image
                            src={user?.photo_url || "/images/pay/icon-contact.svg"}
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
                            ID: {user?.id || 'Not connected'}
                        </p>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center mb-[60px]">
                    <div 
                        className="w-[240px] h-[240px] mb-4"
                        dangerouslySetInnerHTML={{ 
                            __html: qrCodeSvg || `<div class="w-full h-full bg-gray-100 flex items-center justify-center">No Address</div>` 
                        }}
                    />
                    <p className="text-[#9CA3AF] text-[15px] text-center">
                        Scan the QR code to send me payment
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleCopyLink}
                        className="w-full bg-[#6D56F2] text-white py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#5842d8]"
                    >
                        Copy My Link
                    </button>
                    <div className="flex gap-4">
                        <button
                            onClick={handleScan}
                            className="flex-1 border border-[#6D56F2] text-[#6D56F2] py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#6D56F2] hover:text-white"
                        >
                            Scan
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 border border-[#6D56F2] text-[#6D56F2] py-4 rounded-lg text-base font-medium transition-colors hover:bg-[#6D56F2] hover:text-white"
                        >
                            Share URL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 