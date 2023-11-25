import { selectBlock } from "./map.js"

let autocomplete;

const latitudePerDegree = 111.05;
const latitudeToBlockHeight = 5.154200;
const lonScaler = 2.7193; // found experimenting with values

const coordinateOrigin = {
    lat: -34.395683,
    lng: 166.179826
}
let blockMap;
fetch('resources/block_locations.json')
    .then((response) => response.json())
    .then((json) => blockMap = JSON.parse(json));


function longitudeToBlockWidth(latitude) {
    let latInRadians = latitude * (Math.PI / 180);
    return Math.cos(latInRadians) + lonScaler
}
/**
 * Initialize the autocomplete listener.
 * Autocomplete only requests name and physical location data to reduce costs.
 * @see https://developers.google.com/maps/documentation/javascript/reference/place#Place
 */
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            componentRestrictions: { 'country': ['NZ'] },
            fields: ['name', 'geometry']
        }
    )
    autocomplete.addListener('place_changed', onPlaceChanged);
}

/**
 * Callback function called each time an address is selected from the dropdown.
 */
function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    } else {
        const coords = place.geometry.location;
        let blockNum = calculateBlockFromCoords(coords);
        selectBlock(blockNum);
    }
}

function calculateBlockFromCoords(coords) {
    let deltaLat = Math.abs(coords.lat() - coordinateOrigin.lat);
    let deltaLng = coords.lng() - coordinateOrigin.lng;
    let heightOffset = Math.floor(Math.max(0, deltaLat * latitudeToBlockHeight));
    let widthOffset = Math.floor(Math.max(0, deltaLng * longitudeToBlockWidth(coords.lat())));
    return blockMap[heightOffset][widthOffset];
}

// Import Google Autocomplete API
let script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDRnSo6HN8JMTymtUZjUameJva9TIh6SrE&libraries=places&callback=initAutocomplete';
script.async = true;
window.initAutocomplete = initAutocomplete;
document.head.appendChild(script);