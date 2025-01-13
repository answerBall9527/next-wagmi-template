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
    WebApp: {
        initDataUnsafe: {
            user?: TelegramUser;
            start_param?: string;
        };
    };
}

interface Telegram {
  WebApp: TelegramWebApp;
}

interface Window {
  Telegram: TelegramWebApp;
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export {}; 