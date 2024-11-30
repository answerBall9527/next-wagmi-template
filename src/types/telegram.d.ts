declare global {
    interface Window {
        Telegram: {
            WebApp: {
                viewportHeight: number;
                isExpanded: boolean;
                expand: () => void;
                showScanQrPopup: (params: {
                    text?: string;
                },  callback?: (result: any) => void) => Promise<string>;
                closeScanQrPopup: () => void;
            };
        };
    }
}

export {}; 