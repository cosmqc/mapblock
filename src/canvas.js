// Draws on invisible canvas that doesn't resize, then pastes it on the one visible to the user, scaled correctly.
// https://cantwell-tom.medium.com/create-a-scalable-canvas-in-javascript-f8ea5ac0ce34

let onScreenCVS = document.getElementById("lineCanvas");
let onScreenCTX = onScreenCVS.getContext("2d");

let baseDimension;
let rect;
setSize();
onScreenCVS.width = baseDimension;
onScreenCVS.height = baseDimension;

let img = new Image;
let source = onScreenCVS.toDataURL();

export let offScreenCTX;
let offScreenCVS = document.createElement('canvas');
offScreenCTX = offScreenCVS.getContext("2d");

offScreenCVS.width = window.width;
offScreenCVS.height = window.height;

// draw a shaped line from arrow to (x,y)
export function drawToSquare(block) {
    let bounding = document.getElementById('priceBox').getBoundingClientRect();
    let b_x = bounding.left
    let b_y = bounding.top + (bounding.height / 4)

    let x = block.gridCoords.x - window.scrollX
    let y = block.gridCoords.y - window.scrollY

    onScreenCTX.clearRect(0, 0, onScreenCTX.width, onScreenCTX.height);
    onScreenCTX.beginPath();
    onScreenCTX.strokeStyle = '#B7EF8B';
    onScreenCTX.lineWidth = 2;
    onScreenCTX.moveTo(b_x, b_y);
    onScreenCTX.lineTo(b_x - 40, b_y);
    onScreenCTX.moveTo(b_x - 40, b_y);
    onScreenCTX.lineTo(b_x - 40, y);
    onScreenCTX.moveTo(b_x - 40, y);
    onScreenCTX.lineTo(x, y);
    onScreenCTX.stroke();
    onScreenCTX.closePath();

    source = offScreenCVS.toDataURL();
    renderImage();
}

function renderImage() {
    img.onload = () => {
        onScreenCVS.width = baseDimension;
        onScreenCVS.height = baseDimension;
        //Prevent blurring
        onScreenCTX.imageSmoothingEnabled = false;
        onScreenCTX.clearRect(0, 0, onScreenCTX.width, onScreenCTX.height);
        onScreenCTX.drawImage(img, 0, 0, onScreenCVS.width, onScreenCVS.height);
    }
    img.src = source;
}

function setSize() {
    rect = onScreenCVS.parentNode.getBoundingClientRect();
    rect.height > rect.width ? baseDimension = rect.width : baseDimension = rect.height;
}

export function flexCanvasSize() {
    setSize();
    renderImage();
}