'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { PaymentType, redpocketSourceType } from "@/types/payment";
import { TelegramUser } from "@/types/telegram";

interface DonatorInfo {
    username: string;
    amount: number;
    timestamp: string;
}

export default function RedPacketPage() {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [sourceType, setSourceType] = useState<redpocketSourceType>('receive');

    useEffect(() => {
        // 解决夜间模式黑底问题
        const setHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const container = document.querySelector('.redpocket-container');
            if (container) {
                (container as HTMLElement).style.height = `${window.innerHeight}px`;
            }
        };

        setHeight();
        window.addEventListener('resize', setHeight);

        // 获取用户信息
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

        // 获取 URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        setPaymentType(type);

        const source = urlParams.get('source');
        if (source) {
            setSourceType(source as redpocketSourceType);
        }

        return () => window.removeEventListener('resize', setHeight);
    }, []);

    const donator = {
        username: 'User',
        handle: ''
    };

    const amount = {
        value: 5,
        currency: 'USDT'
    };

    const donators: DonatorInfo[] = [
        { username: '@Shrimpgump', amount: 5, timestamp: 'Today 07:33' },
        { username: '@BeeBee', amount: 5, timestamp: 'Today 07:33' },
        { username: '@sunshaine', amount: 5, timestamp: '2024-09-06 13:21' }
    ];

    const handleDonateClick = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000); // 3秒后自动隐藏
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div>Loading...</div>
        </div>;
    }

    return (
        <div className="redpocket-container overflow-y-auto bg-white text-[var(--text-color)] min-h-screen h-full">
            {/* <div className="fixed top-4 right-4 z-50">
                <div className="mt-2 text-sm">
                    Theme: {'Light'}
                </div>
            </div> */}
            
            <div className="flex flex-col p-6 max-w-md mx-auto">
                <div className="flex items-center bg-white mb-10">
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                        <Image 
                            src="/images/pay/icon-contact.svg" 
                            alt="Avatar"
                            width={36}
                            height={36}
                        />
                    </div>
                    <div className="ml-3">
                        <div className="h-[21px] font-[Gilroy] text-[18px] leading-[21px] font-medium text-[#2A1731]">@Jimmy has sent you:</div>
                        <div className="h-[14px] font-[Gilroy] text-[12px] leading-[14px] font-normal text-[#867B8A]">Transaction ID: 123456789</div>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    {/* <h1 className="text-xl font-medium mb-2 text-[var(--text-color)]">Donate/Tip For</h1> */}
                    {/* <div className="flex items-center justify-center gap-3 mb-4">
                        <Image
                            src={user?.photo_url || "https://via.placeholder.com/40x40"}
                            width={40}
                            height={40}
                            alt="Profile"
                            className="rounded-full"
                        />
                        <div className="text-left">
                            <div className="font-medium">
                                {user?.username ? `@${user.username}` : `${user?.first_name || 'User'}`}
                            </div>
                            <div className="text-sm text-gray-500">{user?.username ? user?.id : donator.handle }</div>
                        </div>
                    </div> */}
                    
                    <div className="text-center">
                        <span className="font-[Gilroy-Bold] text-[36px] leading-[43px] text-[#2A1731] text-center">{amount.value}</span>
                        <span className="font-[Gilroy] text-[14px] leading-[43px] text-[#867B8A] ml-2">{amount.currency}</span>
                    </div>
                    <p className="h-[14px] font-[Gilroy] text-[12px] leading-[14px] font-normal text-[#6D56F2] text-center">It has been saved into your balance</p>
                </div>

                <button 
                    onClick={handleDonateClick}
                    className="w-[335px] h-[48px] bg-[#6D56F2] rounded-[8px] text-white font-[Gilroy] text-[18px] leading-[21px] font-medium mb-[30px]"
                >
                    {sourceType === 'receive' ? 'Say Thank You' : 'Donate'}
                </button>   
                
                {showSuccess && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
                        捐赠成功!
                    </div>
                )}

                <div className="mb-8">
                    {paymentType === 'group' && (
                        <h2 className="h-[22px] font-[Gilroy] text-[18px] leading-[22px] font-bold text-[#2A1731] text-left mb-5">Members who already donated</h2>
                    )}
                    <div className="space-y-4">
                        {(paymentType === 'group' ? donators : donators.slice(0, 1)).map((donator, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-[10px]">
                                    <Image
                                        src="/images/pay/icon-contact.svg"
                                        width={36}
                                        height={36}
                                        alt="Donator"
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="h-[17px] font-[Gilroy] text-[14px] leading-[17px] font-bold text-[#2A1731] text-left">{donator.username}</div>
                                        <div className="h-[14px] font-[Gilroy] text-[12px] leading-[14px] font-medium text-[#9D95A0] text-left">{donator.timestamp}</div>
                                    </div>
                                </div>
                                <div className="h-[19px] font-[Gilroy] text-[16px] leading-[19px] font-bold text-[#2A1731] text-right">
                                    {donator.amount} {amount.currency}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 