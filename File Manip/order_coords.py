input_file_loc = "/Users/administrator/Desktop/NZ Map/input.txt"
output_file_loc = "/Users/administrator/Desktop/NZ Map/output.txt"

f = open(output_file_loc, "w")
f.write("")
f.close()

i=0
coordinates = []
output_file = open(output_file_loc, "a")
with open(input_file_loc) as input_file:
    for line in input_file:
        head, not_head = line.split(' coords="')
        orig_coords, tail = not_head.split('" href')
        [x,y,x2,y2] = [int(j) for j in orig_coords.split(",")]
        coordinates.append((x, y, x2, y2))

coordinates = sorted(coordinates, key=lambda z: (z[1], z[0]))

for coord in coordinates:
    output_file.write(f'{head} coords="{coord[0]},{coord[1]},{coord[2]},{coord[3]}" href{tail}\n')

output_file.close()
input_file.close()