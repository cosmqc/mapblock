import { readDB } from './init_firebase.js'

// const domain = 'https://www.mapblocks.co.nz'
const domain = 'https://localhost'
let currently_selected = false

const canvas = document.getElementById("lineCanvas");
const ctx = canvas.getContext('2d');

const areas = $("area");
let blockMap = {};
let timer = null;

const prices = [100, 500, 1000];

class Block {
    constructor(id, gridCoords, price, isBought) {
        this.id = id;
        this.area = areas[id];
        this.gridCoords = gridCoords;
        this.price = price;
        this.isBought = isBought;
    }

    updateBlock(price, isBought) {
        this.price = price;
        this.isBought = isBought;
    }
}

// Updates the blockMap dictionary to fit the DB data
async function updateMapFromDB() {
    const data = await readDB();
    Object.values(data).forEach(block => {
        blockMap[block.id] = new Block(block.id, block.gridCoords, block.price, block.isBought);
    });
}

// Updates the actual page elements to fit the blockMap data. Sort of a hard-reset
function updatePageFromMap() {
    let i = 0;
    $('area').each(function() {
        $(this).data("block", blockMap[i]);
        i++;
    });
}

function formatCoordString(block) {
    return `${block.gridCoords.x},${block.gridCoords.y},${block.gridCoords.x2},${block.gridCoords.y2}`
}

function splitCoords(coordString) {
    let coordArray = coordString.split(",");
    for (let i = 0; i < coordArray.length; i++) {
        coordArray[i] = parseInt(coordArray[i]);
    }
    return coordArray;
}

// draw a shaped line from arrow to (x,y)
function drawToSquare(block) {
    let bounding = null;
    $('.tile-id').each(function() {
        if ($(this).is(':visible')) {
            bounding = $(this).offset();
        }
    });
    let b_x = bounding.left;
    let b_y = bounding.top - 80;

    let coordTuple = splitCoords($(block.area).attr("coords"));
    let x1 = coordTuple[0];
    let y1 = coordTuple[1];
    let x2 = coordTuple[2];
    let y2 = coordTuple[3];
    ctx.beginPath();
    ctx.strokeStyle = '#B7EF8B';
    ctx.lineWidth = 2;
    ctx.moveTo(b_x, b_y);
    ctx.lineTo(b_x - 40, b_y);
    ctx.moveTo(b_x - 40, b_y);
    ctx.lineTo(b_x - 40, y1);
    ctx.moveTo(b_x - 40, y1);
    ctx.lineTo(x2, y1);
    ctx.rect(x1, y1, (x2 - x1), (y2 - y1));
    ctx.stroke();
    ctx.closePath();
}

function debounce(func, time_ms) {
    clearTimeout(timer);
    timer = setTimeout(func, time_ms);
}

function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (currently_selected) {
        drawToSquare(currently_selected);
    }
}

function changeInfo(data) {
    $('.priceBox').each(function() {
        $(this).find('.tile-id').html(`AOTEAROA BLOCK #${data.id}`);
        $(this).find('h2').each(function(i, ele) {
            $(ele).html(`$${prices[i]} - Lorem Ipsum`);
        });
    });
    $('.infoDesc').css("visibility", "visible");
}

export function selectBlock(id) {
    currently_selected = blockMap[id];
    debounce(render, 300);
    changeInfo(blockMap[currently_selected.id]);
}

$('#donate-button').on('click', function() {
    console.log('donate click');
    let id = currently_selected.id;
    if (id) {
        window.location.href = `${domain}/memory.php?id=${id}`;
    }
});

$('#memories-button').on('click', function() {
    console.log('memory click');
    let id = currently_selected.id;
    if (id) {
        window.location.href = `${domain}/view.php?id=${id}`;
    }
});

// Sets an event listener for each tile that fetches data from the data
// dictionary and calls the function to open the info menu
$('body').on('click', 'area', function(event) {
    event.preventDefault();
    currently_selected = $(this).data("block");
    render();
    changeInfo(blockMap[currently_selected.id]);
});

$(window).on('resize', function() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    debounce(render, 300);
})

$('map').ready(async function() {
    $('map').imageMapResize();
    await updateMapFromDB();
    updatePageFromMap();

    // trigger manual resize event to get map to right size 
    let resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);

    // remove loading wheel, show page
    $('.loader').hide();
    $('#popUpParent').show();
    $('#page').show();
});


// Exiting the initial popup
$('#popUpParent').on('click', function(e) {
    if (e.target !== this)
        return;

    $(this).hide();
});

$('.close').on('click', function() {
    $('#popUpParent').hide();
});