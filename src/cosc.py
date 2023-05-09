def power_integrator(alpha, beta, start, end, num_traps):
    """aksdl"""

    # definitions
    f = lambda x: alpha * x ** beta
    area = []
    width = (end - start) / num_traps

    # iterates over each trapezium, starting with i at start and ending delta_x before end
    # note: what is being calculated and appended to area is the average height of the trapezium,
    # not the actual area
    i = start
    while (i + width) <= end:
        area.append((f(i) + f(i+width)) / 2)
        i += width

    # sums all nums in the area list into result -> does same thing as sum(area)
    result = 0
    for number in area:
        result += number
    
    #returns total area, as result is sum of avg heights, and width is width
    return width * result

ans = power_integrator(2.5, 3.0, 0.0, 1.0, 99)
print(f"{ans:.6f}")