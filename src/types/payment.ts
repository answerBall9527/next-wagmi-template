export type PaymentType = 'sendToContactFromHome' | 'sendToContactFromScan' | 'external_wallet' | 'group';

export type redpocketSourceType = 'send' | 'receive'

export type SplitType = 'evenly' | 'randomly';

export interface ReceiverInfo {
  id: string;
  username: string;
  photoUrl: string;
}

export interface TokenOption {
  value: string;
  label: React.ReactNode;
  balance: string;
  network?: string;
} 