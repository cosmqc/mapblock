import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get} from "firebase/database"

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
export function writeTileData(id, coords, price) {
    set(ref(database, 'tiles/' + id), {
        id: id,
        coordinates: {
            x: parseInt(coords[0]),
            y: parseInt(coords[1]),
            x2: parseInt(coords[2]),
            y2: parseInt(coords[3])
        },
        price: price
    });
}

// requests tile data from database and returns value once promise fulfilled.
export async function readTileData(id) {
    const snapshotRef = ref(database, 'tiles/' + id);
    let data = await get(snapshotRef).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log(`No data for tile ${id}`)
        }
    });
    return data;
}