import { Timestamp } from 'firebase/firestore';

export interface Registration {
  id: string;
  registrationId: string;
  customerId: string;
  registrationLabel?: string;
  type: string;
  volume: number;
  year: number;
  validTo: Timestamp;
}
