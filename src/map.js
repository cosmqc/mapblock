import { readBlockData, writeBlockData, readDB } from './init_firebase.js'

const priceMultipliers = [5, 100, 2000]
const canvas = document.getElementById("lineCanvas");
const arrow = document.getElementById("arrow");
const context = canvas.getContext('2d');
let arrow_bounding = arrow.getBoundingClientRect();
let currently_selected = false
const img_w_to_h_ratio = $('img').naturalWidth / $('img').naturalHeight

let blockMap = {};

class Block {
    constructor(id, mapCoords, gridCoords, price, isBought) {
        this.id = id;
        this.mapCoords = mapCoords;
        this.gridCoords = gridCoords;
        this.price = price;
        this.isBought = isBought;
    }

    updateBlock(price, isBought) {
        this.price = price;
        this.isBought = isBought;
    }
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
        blockMap[block.id] = new Block(block.id, block.mapCoords, block.gridCoords, block.price, block.isBought);
    });
}

// Updates the actual page elements to fit the blockMap data. Sort of a hard-reset
function updatePageFromMap() {
    let i = 0;
    $('area').each(function() {
        $(this).data("block", blockMap[i]);
        $(this).attr("coords", formatCoordString(blockMap[i]));
        i++;
    });
}

function formatCoordString(block) {
    return `${block.gridCoords.x},${block.gridCoords.y},${block.gridCoords.x2},${block.gridCoords.y2}`
}

function changeInfo(data) {
    $('#tile-id').html(`Aotearoa Block #${data.id}`);
    $('.price').each(function() {
        $(this).html(`$${data.price}<br>
        <form action="/checkout.php" method="POST">
            <button type="submit" id="checkout-button">
                Checkout
            </button>
      </form>`);
        $(this).css('visibility', 'visible');
    });
}

// draw a shaped line from arrow to (x,y)
function drawToSquare(ctx, block) {
    console.log(block);
    let arrow_x = arrow_bounding.left
    let arrow_y = arrow_bounding.top + (arrow_bounding.height / 2)

    let x = block.gridCoords.x - window.scrollX
    let y = block.gridCoords.y - window.scrollY

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(arrow_x, arrow_y);
    ctx.lineTo(arrow_x - 20, arrow_y);
    ctx.moveTo(arrow_x - 20, arrow_y);
    ctx.lineTo(arrow_x - 20, y);
    ctx.moveTo(arrow_x - 20, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
}

// Resize the canvas to fit the screen.
function resizeCanvas() {
    const canvas = document.getElementById('lineCanvas');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    $('#nz_map').mapster('resize', window.innerWidth, window.innerHeight, 1000);
}

function setupImageMapster() {
    $('#nz_image').mapster({
        mapKey: 'data-id',
        stroke: true,
        strokeWidth: 2,
        strokeColor: 'ff0000',
        singleSelect: true,
        scaleMap: true
    });
}

// Sets an event listener for each tile that fetches data from the data
// dictionary and calls the function to open the info menu
$('body').on('click', 'area', function(event) {
    event.preventDefault();
    let block = $(this).data("block");
    drawToSquare(context, block);
    currently_selected = block;
    changeInfo(blockMap[block.id]);
});

// move line on scroll
$(window).on('scroll', function() {
    if (currently_selected) {
        drawToSquare(context, currently_selected);
    }
});

// Make sure bounding box doesnt get distorted by screen resize
$(window).on('resize', function() {
    resizeCanvas();
    arrow_bounding = arrow.getBoundingClientRect();
    $('#nz_image').mapster('resize', window.innerHeight * img_w_to_h_ratio, window.innerHeight)
    
});

$('map').ready(async function() {
    resizeCanvas();
    await updateMapFromDB();
    setupImageMapster();
    updatePageFromMap();
    console.log('js loaded');
});