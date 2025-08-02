import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, type DocumentData } from 'firebase/firestore';

// Assuming a type definition for Customer exists, similar to CustomerReturn
// If not, we should create one in shared/types/customer.ts
export interface Customer {
    id: string;
    city: string;
    commercial_name: string;
    house_number: string;
    postal_code: string;
    street_name: string;
    createdAt: Date;
}

export const useCustomerStore = defineStore('customerStore', () => {
    // Get the firestore instance from our plugin
    const { $firestore } = useNuxtApp();
    const customersCollection = collection($firestore, 'customers');

    // State
    const customers = ref<Customer[]>([]);
    const currentCustomer = ref<Customer | null>(null);
    const isLoading = ref(false);

    // Actions
    async function fetchCustomers() {
        isLoading.value = true;
        try {
            const querySnapshot = await getDocs(customersCollection);

            customers.value = querySnapshot.docs.map((doc: DocumentData) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    city: data.city,
                    commercial_name: data.commercial_name,
                    house_number: data.house_number,
                    postal_code: data.postal_code,
                    street_name: data.street_name,
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                } as Customer;
            });
        } catch (error) {
            console.error("Error fetching customers: ", error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchCustomerById(id: string) {
        isLoading.value = true;
        try {
            const customerDocRef = doc($firestore, 'customers', id);
            const docSnap = await getDoc(customerDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                currentCustomer.value = {
                    id: docSnap.id,
                    city: data.city,
                    commercial_name: data.commercial_name,
                    house_number: data.house_number,
                    postal_code: data.postal_code,
                    street_name: data.street_name,
                    createdAt: data.createdAt?.toDate() ?? new Date(),
                } as Customer;
            } else {
                console.log("No such document!");
                currentCustomer.value = null;
            }
        } catch (error) {
            console.error("Error fetching customer: ", error);
        } finally {
            isLoading.value = false;
        }
    }

    async function addCustomer(newCustomer: Omit<Customer, 'id' | 'createdAt'>) {
        isLoading.value = true;
        try {
            await addDoc(customersCollection, {
                ...newCustomer,
                createdAt: serverTimestamp(),
            });
            await fetchCustomers(); // Refetch to update the list
        } catch (error) {
            console.error("Error adding customer: ", error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        customers,
        currentCustomer,
        isLoading,
        fetchCustomers,
        fetchCustomerById,
        addCustomer,
    };
});
