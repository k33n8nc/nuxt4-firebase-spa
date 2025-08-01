import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, serverTimestamp, type DocumentData, query, orderBy } from 'firebase/firestore';
import type {CustomerReturn} from "#shared/types/customerReturn";


export const useReturnStore = defineStore('returnStore', () => {
    // Get the firestore instance from our plugin
    const { $firestore } = useNuxtApp();
    const returnsCollection = collection($firestore, 'customerReturns');

    // State
    const returns = ref<CustomerReturn[]>([]);
    const isLoading = ref(false);

    // Actions
    async function fetchReturns() {
        isLoading.value = true;
        try {
            // Query to order returns by creation date, newest first
            const q = query(returnsCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);

            returns.value = querySnapshot.docs.map((doc: DocumentData) => {
                const data = doc.data();
                return {
                    id: doc.id, // Use the Firestore document ID
                    store: data.store,
                    items: data.items,
                    // Convert Firestore Timestamp to a JS Date object
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                } as CustomerReturn;
            });
        } catch (error) {
            console.error("Error fetching returns: ", error);
            // You could add user-facing error handling here
        } finally {
            isLoading.value = false;
        }
    }

    async function addReturn(newReturn: Omit<CustomerReturn, 'id' | 'createdAt'>) {
        isLoading.value = true;
        try {
            await addDoc(returnsCollection, {
                ...newReturn,
                createdAt: serverTimestamp(), // Use server timestamp for consistency
            });
            // For better UX, refetch the list to include the new item
            await fetchReturns();
        } catch (error) {
            console.error("Error adding return: ", error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        returns,
        isLoading,
        fetchReturns,
        addReturn,
    };
});