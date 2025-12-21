import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { distanceBetween, geohashQueryBounds } from "geofire-common";

admin.initializeApp();

const db = admin.firestore();

export const findNearbyClubs = functions.https.onCall(async (data, context) => {
    const { centerLatitude, centerLongitude, radiusInKm } = data;

    if (typeof centerLatitude !== 'number' || typeof centerLongitude !== 'number' || typeof radiusInKm !== 'number') {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid input parameters.');
    }

    const radiusInM = radiusInKm * 1000;
    const center: [number, number] = [centerLatitude, centerLongitude];

    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
        const q = db.collection('clubs')
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);
        promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const matchingDocs = [];

    for (const snap of snapshots) {
        for (const doc of snap.docs) {
            const club = doc.data();
            const lat = club.latitude;
            const lng = club.longitude;

            // We have to filter out a few false positives due to GeoHash
            // accuracy, but most will be accurate
            const distanceInKm = distanceBetween([lat, lng], center);
            if (distanceInKm <= radiusInKm) {
                matchingDocs.push({ ...club, distance: distanceInKm });
            }
        }
    }

    return matchingDocs;
});
