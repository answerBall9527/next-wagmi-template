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

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface WebAppInitData {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    start_param?: string;
    auth_date?: string;
    hash?: string;
}

interface WebApp {
    initData: string;
    initDataUnsafe: WebAppInitData;
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: any;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: any;
    MainButton: any;
    HapticFeedback: any;
    close: () => void;
    expand: () => void;
    openLink: (url: string) => void;
    openTelegramLink: (url: string) => void;
    ready: () => void;
    sendData: (data: any) => void;
    switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
}

interface TelegramWebApp {
    initDataUnsafe: {
        start_param?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

interface Window {
    Telegram?: {
        WebApp?: TelegramWebApp;
    };
}

export {}; 