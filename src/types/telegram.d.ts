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

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                viewportHeight: number;
                isExpanded: boolean;
                expand: () => void;
                setBackgroundColor: (color: string) => void;
                setHeaderColor: (color: string) => void;
                showScanQrPopup(params: ScanQrPopupParams, callback?: (data: string) => boolean): void
                closeScanQrPopup: () => void;
                sendData(data: string): void;
                openTelegramLink(url: string): void;
                colorScheme: 'dark' | 'light';
            };
        };
    }
}

export {}; 