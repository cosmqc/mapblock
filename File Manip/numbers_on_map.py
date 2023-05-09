from PIL import Image, ImageDraw, ImageFont
import json

img_path = '../src/nz-block-placements.jpeg'
tiles_path = '/Users/administrator/Desktop/NZ Map/src/tiles.json'
img = Image.open(img_path)
font = ImageFont.truetype("../src/arial/arial.ttf", 8)

with open(tiles_path) as file:
    tiles = json.load(file)
print('\n\n\n\n\n')

output_dict = {}
for tile in tiles['tiles']:
    coordinates = tile['coordinates']
    tile_id = tile['id']
    output_dict[int(tile_id)] = coordinates


draw = ImageDraw.Draw(img)
for tile_id, coords in output_dict.items():
    draw.text((coords['x'] + 2, coords['y'] + 2), str(tile_id), (0,0,0), font=font)

img.save('output.png')

