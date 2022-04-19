import { readTileData, writeTileData } from './init_firebase'

// Helper function, reuploads the entire database of tiles.
function updateDB() {
  const tiles = document.querySelectorAll('area');
  for (var tile of tiles) {
    writeTileData(tile.getAttribute('data-id'), tile.getAttribute('coords').split(','), 1);
  }
}

// Open menu that displays tile ID, price, coordinates?, and purchase info.
// Clark's design flagged in emails.
function openMenu(data) {
  let coords = data.coordinates;
  alert(`Tile ${data.id}, $${data.price}.\nCorners are (${coords.x},${coords.y}), and (${coords.x2},${coords.y2}).`);
}

// Sets an event listener for each tile that fetches data from the database
// and calls the function to open the info menu
function setOnClick() {
  const tiles = document.querySelectorAll('area');
  for (let tile of tiles) {
    tile.addEventListener('click', async function () {
      let id = tile.getAttribute('data-id');
      let data = await readTileData(id);
      openMenu(data);
    });
  }
}

// draw a line given the coords
function drawLine(ctx, x1, y1, x2, y2) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
// Set a listener so the box arrow follows the pointer
 let count = 0;
 const canvas = document.getElementById("lineCanvas");
 let context = canvas.getContext('2d');
 window.addEventListener('mousemove', e => {
   drawLine(context, 0,0,e.offsetX, e.offsetY);
 });


// onload, set onclick listeners
setOnClick();
