input_file_loc = "/Users/administrator/Desktop/NZ Map/File Manip/input.txt"
output_file_loc = "/Users/administrator/Desktop/NZ Map/File Manip/output.txt"

f = open(output_file_loc, "w")
f.write("")
f.close()


coordinates = []
output_file = open(output_file_loc, "a")
with open(input_file_loc) as input_file:
    for i, line in enumerate(input_file):
        line = line.replace("FILLER\"", f"javascript:void(0)\" data-id='{i}'")
        output_file.write(line)

coordinates.sort()

output_file.close()
input_file.close()