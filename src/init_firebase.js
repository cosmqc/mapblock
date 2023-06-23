import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyB8eAdSKah1pSBGBS5CsNUS16fW9Bw74lM",
    authDomain: "c-map-1f178.firebaseapp.com",
    projectId: "c-map-1f178",
    storageBucket: "c-map-1f178.appspot.com",
    messagingSenderId: "891111046312",
    appId: "1:891111046312:web:1da3ad7431665691fb169d",
    measurementId: "G-XBC5TZ3DKD"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// parses data and writes to database
export function writeBlockData(id, gridCoords, mapCoords, price, isBought) {
    set(ref(database, 'blocks/' + id), {
        id: id,
        gridCoords: gridCoords,
        mapCoords: mapCoords,
        price: price,
        isBought: isBought
    });
}

// requests tile data from database and returns value once promise fulfilled.
export async function readBlockData(id) {
    const snapshotRef = ref(database, 'blocks/' + id);
    let data = await get(snapshotRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.error(`No data for tile ${id}`)
        }
    });
    return data;
}

export async function readDB() {
    const snapshotRef = ref(database, 'blocks/')
    let data = await get(snapshotRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.error("Database couldn't be read")
        }
    });
    return data;
}