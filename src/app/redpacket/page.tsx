'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import tgapp from '@telegram-apps/sdk-react';

interface DonatorInfo {
    username: string;
    amount: number;
    timestamp: string;
}

export default function RedPacketPage() {
    useEffect(() => {
        const setHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const container = document.querySelector('.redpacket-container');
            if (container) {
                (container as HTMLElement).style.height = `${window.innerHeight}px`;
            }
        };

        setHeight();
        window.addEventListener('resize', setHeight);
        return () => window.removeEventListener('resize', setHeight);
    }, []);

    const [isDark, setIsDark] = useState(false);

    const donator = {
        username: '@Tristan',
        handle: 'tristan@stakestone.io'
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
    console.log('tgapp', tgapp);
    return (
        <div className="redpacket-container overflow-y-auto bg-white text-[var(--text-color)] min-h-screen h-full">
            <div className="fixed top-4 right-4 z-50">
                <div className="mt-2 text-sm">
                    Theme: {isDark ? 'Dark' : 'Light'}
                </div>
            </div>
            
            <div className="flex flex-col p-6 max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-medium mb-2 text-[var(--text-color)]">Donate/Tip For</h1>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image
                            src="https://via.placeholder.com/40x40"
                            width={40}
                            height={40}
                            alt="Profile"
                            className="rounded-full"
                        />
                        <div className="text-left">
                            <div className="font-medium">{donator.username}</div>
                            <div className="text-sm text-gray-500">{donator.handle}</div>
                        </div>
                    </div>
                    
                    <div className="text-center mb-4">
                        <span className="text-4xl font-bold">{amount.value}</span>
                        <span className="text-lg ml-2">{amount.currency}</span>
                    </div>
                    <p className="text-sm text-gray-500">To help stop the climate change</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-medium mb-4 text-[var(--text-color)]">Members who already donated</h2>
                    <div className="space-y-4">
                        {donators.map((donator, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="https://via.placeholder.com/36x36"
                                        width={36}
                                        height={36}
                                        alt="Donator"
                                        className="rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium">{donator.username}</div>
                                        <div className="text-sm text-gray-500">{donator.timestamp}</div>
                                    </div>
                                </div>
                                <div className="font-medium">
                                    {donator.amount} {amount.currency}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full bg-[#7C5CFC] text-white py-4 rounded-xl text-lg font-medium">
                    Donate
                </button>
            </div>
        </div>
    );
} 