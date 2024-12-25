'use client'

// Updated Tailwind styles for your components in index.js
import Image from "next/image";
import icon42 from '@/assets/42x42.png';
import styles from './styles.module.scss'
// import BottomNav from '@/components/layout/BottomNav'
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

export default function HomePage() {
    const { isConnected } = useAccount()
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                    setIsLoading(false);
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
            } finally {
                setIsLoading(false);
            }
        };

        initTelegram();
    }, []);

    const handleScanClick = async () => {
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
            // 处理扫描结果
            console.log('扫描结果:', result);
            
            // 这里可以添加扫描成功后的业务逻辑
            
        } catch (error) {
            console.error('扫描错误:', error);
        }
    };

    const handleShareClick = () => {
        const shareUrl = 't.me/stakestone_activity_bot/redpacket';
        const shareText = 'shareText11111';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);
        
        window.Telegram.WebApp.openTelegramLink(
            `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}&startapp=command&mode=compact`
        );
    };

    function sendFormattedMessage() {
        if (window.Telegram && window.Telegram.WebApp) {
          const message = {
            text: '欢迎使用我的应用！点击按钮以继续操作。',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '点击我', callback_data: 'button_click' }
                ]
              ]
            }
          };
      
          // 发送消息到 Telegram 频道或用户
          window.Telegram.WebApp.sendData(JSON.stringify(message));
        }
      }

    const WalletIcon = () => {
        if (isConnected) {
            return <Image src="/images/eth.svg" width={36} height={36} alt="Connected Wallet" />
        }
        return (
            <div className="w-[36px] h-[36px] rounded-full border-2 border-[#6D56F2] border-dashed flex items-center justify-center animate-pulse">
                <div className="w-[18px] h-[18px] rounded-full border-2 border-[#6D56F2] bg-[#6D56F2]/10" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full h-full bg-background overflow-hidden relative flex flex-col p-[37px_15px_30px]">
                {/* Header section */}
                <div className="flex flex-col pb-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center w-[122px]">
                            <Image
                                src={user?.photo_url || "https://via.placeholder.com/36x36"}
                                width={36}
                                height={36}
                                alt="Profile Picture"
                                className="rounded-full"
                            />
                            <span className="ml-2 text-secondary text-lg font-medium">
                                {user?.username ? `@${user.username}` : user?.first_name || '@User'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image 
                                src="/images/scan.svg" 
                                width={36} 
                                height={36} 
                                alt="Icon"
                                onClick={handleScanClick}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                            <Image 
                                src="/images/share.svg" 
                                width={36} 
                                height={36} 
                                alt="Share Icon" 
                                onClick={handleShareClick}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                            />
                            <WalletIcon />
                        </div>
                    </div>
                </div>
                {/* send & request */}
                <div className="flex justify-center items-center mt-[] gap-[58px] mb-[40px]">
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://lanhu-oss.lanhuapp.com/SketchPng1e28a1e494501a6ccee0be170375512a7b1a520cd3e67eb10858221837935d62"
                            width={30}
                            height={30}
                            alt="Send Icon"
                        />
                        <span className="text-secondary text-16px font-bold mt-2">Send</span>
                    </div>
                    <div className="h-10 w-px bg-[#E7E4E8]"></div>
                    <div className="flex flex-col items-center">
                        <Image
                            src="https://lanhu-oss.lanhuapp.com/SketchPngf4ac3a7970cf56c2fc89e6718e14ca49de41da9bab4883dd293a7b6defd21765"
                            width={30}
                            height={30}
                            alt="Request Icon"
                        />
                        <span className="text-secondary text-16px font-bold mt-2">Request</span>
                    </div>
                </div>
                {/* Main Balance Card Section */}
                <div className="rounded-large shadow-card w-full bg-background p-[30px_20px] mt-[-1px]">
                    <div className="relative flex flex-col items-start bg-lightPurple rounded-large p-[30px_39px_30px_20px]">
                        <span className="w-[54px] h-[16px] font-gilroy font-normal text-[14px] text-white leading-[16px] text-left text-opacity-70">Balance</span>
                        <div className="absolute top-[73px] right-[45px] bg-purple-700 px-2 py-1 rounded-full text-xs flex items-center">
                            <span className="ml-1 text-green-300">24H: </span>
                            <span className="ml-1 text-green-300">+0.34</span>
                        </div>
                        <div className="flex items-baseline mt-2">
                            <span className="text-white text-4xl font-medium">566.99</span>
                            <span className="text-white text-sm ml-1">ETH</span>
                        </div>
                        <span className="text-white text-sm mt-1">$58848.99</span>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <div className="flex flex-col items-center">
                            <span className="text-secondary text-2xl font-medium">10.73%</span>
                            <span className="text-grayText text-xs">APY</span>
                        </div>
                        <div className="h-10 w-px bg-[#E7E4E8]"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <div className="flex relative">
                                    <div className="w-[28px] h-[28px] rounded-full overflow-hidden">
                                        <Image src={icon42} width={42} height={42} alt="Icon" />
                                    </div>
                                    <div className="w-[28px] h-[28px] rounded-full overflow-hidden relative -left-2">
                                        <Image src={icon42} width={42} height={42} alt="Icon" />
                                    </div>
                                    <div className="w-[28px] h-[28px] rounded-full overflow-hidden relative -left-4">
                                        <Image src={icon42} width={42} height={42} alt="Icon" />
                                    </div>
                                    <div className="w-[28px] h-[28px] rounded-full overflow-hidden relative -left-6">
                                        <Image src={icon42} width={42} height={42} alt="Icon" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-grayText mt-2 text-[12px]">More Rewards with</span>
                        </div>
                    </div>
                    <div className="flex justify-between mt-10">
                        <button className="w-[145px] rounded-small border border-primary px-[45px] py-3 text-primary text-lg font-medium">
                            Deposit
                        </button>
                        <button className="w-[145px] bg-primary text-white rounded-small px-[33px] py-3 text-lg font-medium">
                            Withdraw
                        </button>
                    </div>
                    <span className="text-grayText text-xs mt-4 block text-center">
                        Smart Saving for Everyone
                    </span>
                </div>
                {/* Bottom Navigation Section */}
                {/* <BottomNav /> */}
            </div>
        </motion.div>
    );
}

// Notes:
// - Replace `/images/...` paths with your local assets paths.
// - The tailwind.config.js extends the theme to match the colors, border-radius, and box-shadow seen in the design.
// - Flexbox is heavily used to align components as per the design.
// - Image components assume you have an images folder under public for Next.js.

