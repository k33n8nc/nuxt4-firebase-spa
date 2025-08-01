export interface ReturnItem {
    id: string; // A temporary client-side ID for v-for keys
    name: string;
    price: number;
}

export interface CustomerReturn {
    id: string; // This will be the Firestore document ID
    store: string;
    items: ReturnItem[];
    createdAt: Date; // Good practice to track when it was created
}