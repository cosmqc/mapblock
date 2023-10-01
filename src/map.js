import { readDB } from './init_firebase.js'
let currently_selected = false

const canvas = document.getElementById("lineCanvas");
const ctx = canvas.getContext('2d');

const areas = $("area");
let blockMap = {};
let timer = null;

class Block {
    constructor(id, mapCoords, price, isBought) {
        this.id = id;
        this.area = areas[id];
        this.mapCoords = mapCoords;
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
        blockMap[block.id] = new Block(block.id, block.mapCoords, block.price, block.isBought);
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
    let bounding = document.getElementById('tile-id').getBoundingClientRect();
    let b_x = bounding.x;
    let b_y = bounding.y - 50;

    let coordTuple = splitCoords($(block.area).attr("coords"));
    let x1 = coordTuple[0];
    let y1 = coordTuple[1];
    let x2 = coordTuple[2];
    let y2 = coordTuple[3];
    console.log(x1, y1, x2, y2);
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

function render() {
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#202020';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    $('area').each(function() {
        if ($(this).data("block").isBought) {
            let coordTuple = splitCoords($(this).attr("coords"));
            let x1 = coordTuple[0];
            let y1 = coordTuple[1];
            let x2 = coordTuple[2];
            let y2 = coordTuple[3];

            ctx.beginPath();
            ctx.fillRect(x1, y1, (x2 - x1), (y2 - y1));
            ctx.closePath();
        }
    })
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (currently_selected) {
        drawToSquare(currently_selected);
    }
}

function changeInfo(data) {
    $('#tile-id').html(`Aotearoa Block #${data.id}`);
    $('#price').html(`$${data.price}`);
    $('#infoDesc').css('visibility', 'visible');
}

function debounce() {
    clearTimeout(timer);
    timer = setTimeout(render, 300);
}


// Add load listener to show pag when all images loaded
window.addEventListener('load', function() {
    alert("It's loaded!")
})

// Sets an event listener for each tile that fetches data from the data
// dictionary and calls the function to open the info menu
$('body').on('click', 'area', function(event) {
    event.preventDefault();
    currently_selected = $(this).data("block");
    render();
    changeInfo(blockMap[currently_selected.id]);
});

$('#checkout-button').on('click', function(event) {
    event.preventDefault()
    if (currently_selected != false) {
        $.ajax({
            type: "POST",
            url: "../../checkout.php",
            data: JSON.stringify({
                "name": `Block #${currently_selected.id}`,
                "price": currently_selected.price,
            }),
            contentType: "application/json",
            success: function(result) {
                window.location.href = result;
            },
            error: function(result) {
                alert('An error occured, please try again');
                console.log(`Error talking w Stripe. Received URL: ${result}`);
            }
        });
    }
})

$(window).on('resize', function() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.setAttribute('width', window.getComputedStyle(canvas, null).getPropertyValue("width"));
    canvas.setAttribute('height', window.getComputedStyle(canvas, null).getPropertyValue("height"));
    debounce(render, 300);
})

$('map').ready(async function() {
    imageMapResize();
    await updateMapFromDB();
    updatePageFromMap();


    // trigger manual resize event to get map to right size 
    let resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
});