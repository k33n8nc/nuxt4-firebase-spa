import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId,
    };

    // Initialize Firebase
    const app: FirebaseApp = initializeApp(firebaseConfig);
    const firestore: Firestore = getFirestore(app);
    const auth: Auth = getAuth(app);

    // Provide the instances to the Nuxt app
    // You can now access them anywhere with useNuxtApp().$firestore
    return {
        provide: {
            firebaseApp: app,
            firestore: firestore,
            auth: auth,
        },
    };
});