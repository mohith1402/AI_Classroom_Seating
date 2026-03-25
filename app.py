import math
from flask import Flask, render_template, request

app = Flask(__name__)

def is_valid(grid, r, c, group_name):
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc]:
            if grid[nr][nc][1] == group_name:
                return False
    return True

def solve_with_gaps(grid, students):
    rows = len(grid)
    cols = len(grid[0])
    
    groups = {}
    for s in students:
        groups.setdefault(s[1], []).append(s)
        
    for r in range(rows):
        for c in range(cols):
            if sum(len(g) for g in groups.values()) == 0:
                return True
                
            valid_groups = []
            for g_name, members in groups.items():
                if len(members) > 0 and is_valid(grid, r, c, g_name):
                    valid_groups.append(g_name)
                    
            if valid_groups:
                valid_groups.sort(key=lambda x: len(groups[x]), reverse=True)
                best_group = valid_groups[0]
                grid[r][c] = groups[best_group].pop()
                
    return sum(len(g) for g in groups.values()) == 0

@app.route("/", methods=["GET", "POST"])
def index():
    seats = None
    error = None
    rows = 3
    cols = 3

    if request.method == "POST":
        names = request.form.getlist("name[]")
        groups = request.form.getlist("group[]")

        students = [(n, g) for n, g in zip(names, groups) if n.strip() != ""]

        try:
            rows = int(request.form.get("rows", 3))
            cols = int(request.form.get("cols", 3))
        except:
            rows = 3
            cols = 3

        if len(students) < 2:
            error = "Minimum 2 students required"
        else:
            group_counts = {}
            for s in students:
                group_counts[s[1]] = group_counts.get(s[1], 0) + 1
            max_group_size = max(group_counts.values()) if group_counts else 0

            total_capacity = rows * cols
            safe_capacity = math.ceil(total_capacity / 2) 

            # Expand grid automatically if there are too many students OR if gaps are needed
            if max_group_size > safe_capacity or len(students) > total_capacity:
                required_seats = max(len(students), max_group_size * 2)
                new_size = math.ceil(math.sqrt(required_seats))
                rows = new_size
                cols = new_size

            grid = [[None for _ in range(cols)] for _ in range(rows)]
            
            if solve_with_gaps(grid, students):
                seats = grid
            else:
                error = "Could not arrange students. Try manually increasing the grid dimensions."

    return render_template("index.html", seats=seats, error=error, rows=rows, cols=cols)

if __name__ == "__main__":
    app.run(debug=True)
