import { Timestamp } from 'firebase/firestore';

export interface Registration {
  id: string;
  registrationId: string;
  registrationLabel?: string;
  type: string;
  volume: number;
  year: number;
  validTo: Timestamp;
}
