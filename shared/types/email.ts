import type { Timestamp } from 'firebase/firestore';

export interface Email {
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
  customerId?: string;
  sentAt?: Timestamp; // To order the history correctly
  delivery?: {
    startTime: Timestamp;
    endTime: Timestamp;
    state: 'SUCCESS' | 'ERROR' | 'PROCESSING' | 'PENDING';
    attempts: number;
    error?: string;
  };
}
