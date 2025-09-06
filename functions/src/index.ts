import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {Registration} from "../../shared/types/registration";
import {Timestamp} from "firebase-admin/firestore";

admin.initializeApp();
const db = admin.firestore();

export const updateRegistrationAlert = onDocumentWritten(
    "customers/{customerId}/registrations/{registrationId}",
    async (event) => {
        // 1. Get the customerId from the event parameters.
        const { customerId } = event.params;
        const logger = functions.logger;
        logger.info(`Recalculating alert for customer: ${customerId}`);

        // 2. Get a reference to the parent customer document.
        const customerRef = db.collection("customers").doc(customerId);

        // 3. Get all registrations for this specific customer.
        const registrationsSnapshot = await customerRef.collection("registrations").get();

        // Handle the case where the last registration was deleted.
        if (registrationsSnapshot.empty) {
            logger.info("No registrations found. Clearing alert.");
            return customerRef.update({ registrationExpireAlert: null });
        }

        // 4. Find the soonest 'validTo' date.
        // We get the Timestamp from Firestore and convert it to a JS Date object.
        const dates: Date[] = registrationsSnapshot.docs
            .map((doc) => {
                const validTo = (doc.data() as Registration).validTo;
                // Ensure validTo exists and is a Firestore Timestamp before converting.
                if (validTo && validTo instanceof Timestamp) {
                    return validTo.toDate();
                }
                return null;
            })
            .filter((date): date is Date => date !== null); // Filter out any null values.

        if (dates.length === 0) {
            logger.info("No valid 'validTo' dates found. Clearing alert.");
            return customerRef.update({ registrationExpireAlert: null });
        }

        // 5. Find the earliest date.
        // We explicitly get the numeric timestamp with .getTime() for TypeScript.
        const soonestDate = new Date(Math.min(...dates.map(d => d.getTime())));

        // 6. Update the parent customer document.
        logger.info(`Updating customer ${customerId} with soonest date: ${soonestDate.toISOString()}`);
        return customerRef.update({
            registrationExpireAlert: soonestDate,
        });
    }
);