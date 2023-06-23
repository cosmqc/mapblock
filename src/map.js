// TODO
// - move resizeCanvas and arrow_x/arrow_y redefs to a resize listener

import { readBlockData, writeBlockData, readDB } from './init_firebase'

const priceMultipliers = [5, 100, 2000]
const canvas = document.getElementById("lineCanvas");
const arrow = document.getElementById("arrow");
const context = canvas.getContext('2d');
let arrow_bounding = arrow.getBoundingClientRect();
let currently_selected = false

let blockMap = {};

class Block {
    constructor(id, mapCoords, gridCoords) {
        this.id = id;
        this.mapCoords = mapCoords;
        this.gridCoords = gridCoords;
        this.price = Infinity;
        this.isBought = true;
    }

    updateBlock(price, isBought) {
        this.price = price;
        this.isBought = isBought;
    }
}

function updateBlocks() {
    const data = readDB()
    Object.values(blockMap).forEach(block => {
        block.updateBlock(data.id.price, data.id.isBought)
    });
}

// Reuploads the entire page of tiles to the database. Sort of a hard-reset.
function updateDBfromPage() {
    Object.values(blockMap).forEach(block => {
        writeBlockData(block.id, block.mapCoords, block.gridCoords, block.price, block.isBought);
    });
}

// Updates the blockMap dictionary to fit the DB data
async function updateMapFromDB() {
    const data = await readDB();
    Object.values(data).forEach(block => {
        blockMap[block.id] = new Block(block.id, block.mapCoords, block.gridCoords);
    });
}
// Updates the actual page elements to fit the blockMap data. Sort of a hard-reset
function updatePageFromMap() {

}

// Open menu that displays tile ID, price, coordinates?, and purchase info.
// Clark's design flagged in emails.
function changeInfo(data) {
    $('infoBox').html = `Aotearoa Block #${data.id}`
    $('.priceBoxes').each(function(priceBox) {
        this.html = `$${data.price * priceMultipliers[i]}`
    });
}

// draw a shaped line from arrow to (x,y)
function drawToSquare(ctx, x, y, arrow_bounding) {
    let arrow_x = arrow_bounding.left
    let arrow_y = arrow_bounding.top + (arrow_bounding.height / 2)

    x = x - window.scrollX
    y = y - window.scrollY

    context.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(arrow_x, arrow_y);
    ctx.lineTo(arrow_x - 20, arrow_y);
    ctx.moveTo(arrow_x - 20, arrow_y);
    ctx.lineTo(arrow_x - 20, y);
    ctx.moveTo(arrow_x - 20, y);
    ctx.lineTo(x, y);
    ctx.rect(x - 16, y, 16, 15)
    ctx.stroke();
    ctx.closePath();
}

// Resize the canvas to fit the screen.
function resizeCanvas() {
    const canvas = document.getElementById('lineCanvas');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
}

// Sets an event listener for each tile that fetches data from the data
// dictionary and calls the function to open the info menu
$('body').on('click', '.area', function(area) {
    console.log("area clicked")
    area.preventDefault();
    let coords = area.getAttribute('block').gridCoords;
    drawToSquare(context, coords.x2, coords.y1, arrsow_bounding);
    currently_selected = [coords.x2, coords.y1]
    changeInfo(data);
    $('infoDesc').style.visibility = 'visible'
});

// move line on scroll
$(window).on('scroll', function() {
    if (currently_selected) {
        let x = currently_selected[0]
        let y = currently_selected[1]
        drawToSquare(context, x, y, arrow_bounding);
    }
});

// Make sure bounding box doesnt get distorted by screen resize
$(window).on('resize', function() {
    resizeCanvas();
    arrow_bounding = arrow.getBoundingClientRect();
});

resizeCanvas();