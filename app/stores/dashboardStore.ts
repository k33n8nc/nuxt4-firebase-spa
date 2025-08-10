import { defineStore } from 'pinia';
import { collection, getCountFromServer, collectionGroup } from 'firebase/firestore';
import { useNuxtApp } from '#app';

export const useDashboardStore = defineStore('dashboardStore', {
    state: () => ({
        customersCount: 0,
        registrationsCount: 0,
        loading: true,
    }),

    actions: {
        _getDB() {
            // This helper ensures we use the initialized Firestore instance from the Nuxt plugin
            const { $firestore } = useNuxtApp();
            return $firestore;
        },

        async fetchCounts() {
            this.loading = true;
            try {
                const db = this._getDB();

                // Use Promise.all to fetch counts concurrently for better performance
                const [customersSnap, registrationsSnap] = await Promise.all([
                    getCountFromServer(collection(db, 'customers')),
                    getCountFromServer(collectionGroup(db, 'registrations'))
                ]);

                this.customersCount = customersSnap.data().count;
                this.registrationsCount = registrationsSnap.data().count;
            } catch (error) {
                console.error("Error fetching dashboard counts:", error);
                this.customersCount = 0;
                this.registrationsCount = 0;
            } finally {
                this.loading = false;
            }
        }
    },
});