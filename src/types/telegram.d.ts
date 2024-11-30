import telegram from 'telegram-webapps'
interface ScanQrPopupParams {
    /**
     * The text to be displayed under the 'Scan QR' heading, 0-64 characters.
     */
    text?: string
  }

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                viewportHeight: number;
                isExpanded: boolean;
                expand: () => void;
                showScanQrPopup(params: ScanQrPopupParams, callback?: (data: string) => boolean): void
                closeScanQrPopup: () => void;
            };
        };
    }
}

export {}; 