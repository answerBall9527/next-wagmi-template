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
}

interface Telegram {
  WebApp?: TelegramWebApp;
}

interface Window {
  Telegram?: Telegram;
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {}; 