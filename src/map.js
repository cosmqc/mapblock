// TODO
// - move resizeCanvas and arrow_x/arrow_y redefs to a resize listener


import { update } from 'firebase/database';
import { readTileData, writeTileData } from './init_firebase'

const priceMultipliers = [5, 100, 2000]
const canvas = document.getElementById("lineCanvas");
const arrow = document.getElementById("arrow");
const context = canvas.getContext('2d');
let arrow_bounding = arrow.getBoundingClientRect();
let currently_selected = false

// Helper function, reuploads the entire page of tiles to the database.
function updateDBfromPage() {
  const tiles = document.querySelectorAll('area');
  for (const tile of tiles) {
    writeTileData(tile.getAttribute('data-id'), tile.getAttribute('coords').split(','), 1);
  }
}

// Open menu that displays tile ID, price, coordinates?, and purchase info.
// Clark's design flagged in emails.
function changeInfo(data) {
  const infoBox = document.getElementById('tile-id');
  infoBox.innerHTML = `Aotearoa Block #${data.id}`

  const priceBoxes = document.getElementsByClassName('price');
  for (var i = 0; i < priceMultipliers.length; i++) {
    priceBoxes[i].innerHTML = `$${data.price*priceMultipliers[i]}`
  }
}

// Sets an event listener for each tile that fetches data from the database
// and calls the function to open the info menu
function setOnClick() {
  const tiles = document.querySelectorAll('area');
  for (let tile of tiles) {
    tile.addEventListener('click', async function () {
      let id = tile.getAttribute('data-id');
      let data = await readTileData(id);
      let coords = data.coordinates;

      drawToSquare(context, coords.x2, coords.y, arrow_bounding);
      currently_selected = [coords.x2, coords.y]
      changeInfo(data);
      document.getElementById('infoDesc').style.visibility = 'visible'
    });
  }
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

// Make sure bounding box doesnt get distorted by screen resize
 window.addEventListener('resize', e => {
   resizeCanvas();
   arrow_bounding = arrow.getBoundingClientRect();
 });

// move line on scroll
window.addEventListener('scroll', e => {
  if (currently_selected) {
    let x = currently_selected[0]
    let y = currently_selected[1]
    drawToSquare(context, x, y, arrow_bounding);
  }
})

// onload, set onclick listeners
setOnClick();
resizeCanvas();
updateDBfromPage