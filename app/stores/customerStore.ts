import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, type DocumentData, writeBatch } from 'firebase/firestore';
import { useNuxtApp } from '#app';

export const useCustomerStore = defineStore('customerStore', {
    state: () => ({
        customers: [] as Customer[],
    }),

    actions: {
        _getDB() {
            const { $firestore } = useNuxtApp();
            return $firestore;
        },

        async fetchCustomers() {
            try {
                const db = this._getDB();
                const customersCollection = collection(db, 'customers');
                const querySnapshot = await getDocs(customersCollection);
                this.customers = querySnapshot.docs.map((doc: DocumentData) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate(),
                    } as Customer;
                });
            } catch (error) {
                console.error("Error fetching customers:", error);
            }
        },

        async fetchCustomerById(id: string): Promise<Customer | null> {
            try {
                const db = this._getDB();
                const customerDocRef = doc(db, 'customers', id);
                const docSnap = await getDoc(customerDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    return {
                        id: docSnap.id,
                        ...data,
                        createdAt: data.createdAt?.toDate(),
                    } as Customer;
                }
                return null;
            } catch (error) {
                console.error("Error fetching customer:", error);
                return null;
            }
        },

        async addCustomer(newCustomer: Omit<Customer, 'id' | 'createdAt'>) {
            try {
                const db = this._getDB();
                const customersCollection = collection(db, 'customers');
                const docRef = await addDoc(customersCollection, {
                    ...newCustomer,
                    createdAt: serverTimestamp(),
                });
                // Optimistically update state
                this.customers.push({ id: docRef.id, ...newCustomer } as Customer);
            } catch (error) {
                console.error("Error adding customer:", error);
            }
        },

        async updateCustomer(customerId: string, updatedData: Partial<Omit<Customer, 'id'>>) {
            try {
                const db = this._getDB();
                const customerDocRef = doc(db, "customers", customerId);
                await updateDoc(customerDocRef, updatedData);

                // Optimistically update state
                const index = this.customers.findIndex((c: Customer) => c.id === customerId);
                if (index !== -1) {
                    this.customers[index] = { ...this.customers[index], ...updatedData } as Customer;
                }
            } catch (error) {
                console.error("Error updating customer:", error);
            }
        },

        async removeCustomer(customerId: string) {
            try {
                const db = this._getDB();
                const customerDocRef = doc(db, 'customers', customerId);
                const registrationsColRef = collection(customerDocRef, 'registrations');

                // Delete all registrations in a batch
                const registrationsSnapshot = await getDocs(registrationsColRef);
                const batch = writeBatch(db);
                registrationsSnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();

                // Delete the customer document
                await deleteDoc(customerDocRef);

                // Optimistically update state
                this.customers = this.customers.filter((c: Customer) => c.id !== customerId);
            } catch (error) {
                console.error("Error removing customer:", error);
            }
        }
    },
});
