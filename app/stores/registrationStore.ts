import { defineStore } from 'pinia';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, type DocumentData, collectionGroup, query } from 'firebase/firestore';
import { useNuxtApp } from '#app';
import type { Registration } from '#shared/types/registration';

export const useRegistrationStore = defineStore('registrationStore', {
    state: () => ({
        registrations: [] as Registration[],
        isLoading: false,
    }),

    actions: {
        _getDB() {
            const { $firestore } = useNuxtApp();
            return $firestore;
        },

        async fetchAllRegistrations() {
            this.isLoading = true;
            try {
                const db = this._getDB();
                const registrationsQuery = query(collectionGroup(db, 'registrations'));
                const querySnapshot = await getDocs(registrationsQuery);
                this.registrations = querySnapshot.docs.map((doc: DocumentData) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                    } as Registration;
                });
            } catch (error) {
                console.error("Error fetching all registrations:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchRegistrations(customerId: string) {
            this.isLoading = true;
            try {
                const db = this._getDB();
                const registrationsCollection = collection(db, 'customers', customerId, 'registrations');
                const querySnapshot = await getDocs(registrationsCollection);
                this.registrations = querySnapshot.docs.map((doc: DocumentData) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                    } as Registration;
                });
            } catch (error) {
                console.error("Error fetching registrations:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async addRegistration(customerId: string, newRegistration: Omit<Registration, 'id'>) {
            try {
                const db = this._getDB();
                const registrationsCollection = collection(db, 'customers', customerId, 'registrations');
                const docRef = await addDoc(registrationsCollection, {
                    ...newRegistration,
                    createdAt: serverTimestamp(),
                });
                // Optimistically update state
                this.registrations.push({ id: docRef.id, ...newRegistration } as Registration);
            } catch (error) {
                console.error("Error adding registration:", error);
            }
        },

        async updateRegistration(customerId: string, registrationId: string, updatedData: Partial<Omit<Registration, 'id'>>) {
            try {
                const db = this._getDB();
                const registrationDocRef = doc(db, "customers", customerId, 'registrations', registrationId);
                await updateDoc(registrationDocRef, updatedData);

                // Optimistically update state
                const index = this.registrations.findIndex((r: Registration) => r.id === registrationId);
                if (index !== -1) {
                    this.registrations[index] = { ...this.registrations[index], ...updatedData } as Registration;
                }
            } catch (error) {
                console.error("Error updating registration:", error);
            }
        },

        async removeRegistration(customerId: string, registrationId: string) {
            try {
                const db = this._getDB();
                await deleteDoc(doc(db, "customers", customerId, 'registrations', registrationId));
                // Optimistically update state
                this.registrations = this.registrations.filter((r: Registration) => r.id !== registrationId);
            } catch (error) {
                console.error("Error removing registration:", error);
            }
        }
    },
});
