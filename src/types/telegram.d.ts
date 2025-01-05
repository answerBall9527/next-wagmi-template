import telegram from 'telegram-webapps'
interface ScanQrPopupParams {
    /**
     * The text to be displayed under the 'Scan QR' heading, 0-64 characters.
     */
    text?: string
  }

interface ShareUrlParams {
    url: string;
    text?: string;
    button?: {
        text: string;
        url: string;
    };
}

interface TelegramWebApp {
  openTelegramLink: (url: string) => void;
  // 其他 Telegram WebApp 相关的类型定义...
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {}; 