import { Timestamp } from 'firebase/firestore';

export interface Customer {
    id: string;
    city: string;
    commercial_name: string;
    house_number: string;
    postal_code: string;
    street_name: string;
    createdAt: Date;
    email: string;
    phone?: string;
    registrationExpireAlert?: Timestamp | null;
}
