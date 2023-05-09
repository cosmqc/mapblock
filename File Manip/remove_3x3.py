input_file_loc = "/Users/administrator/Desktop/NZ Map/File Manip/input.txt"
output_file_loc = "/Users/administrator/Desktop/NZ Map/File Manip/output.txt"

f = open(output_file_loc, "w")
f.write("")
f.close()

i=0

output_file = open(output_file_loc, "a")
with open(input_file_loc) as input_file:
    for line in input_file:
        head, not_head = line.split(' coords="')
        coords, tail = not_head.split('" href')

        [x,y,x2,y2] = [int(coord) for coord in coords.split(",")]
        w, h = x2 - x, y2 - y
        if (w < 20 and h < 20):
            output_file.write(f'{head} coords="{coords}" href{tail}')
        else:
            i += 1

output_file.close()
input_file.close()
print(i)