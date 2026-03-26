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
    rows, cols = len(grid), len(grid[0])
    groups = {}
    for s in students:
        groups.setdefault(s[1], []).append(s)
        
    for r in range(rows):
        for c in range(cols):
            if sum(len(g) for g in groups.values()) == 0:
                return True
            valid_groups = [gn for gn, m in groups.items() if len(m) > 0 and is_valid(grid, r, c, gn)]
            if valid_groups:
                valid_groups.sort(key=lambda x: len(groups[x]), reverse=True)
                grid[r][c] = groups[valid_groups[0]].pop()
    return sum(len(g) for g in groups.values()) == 0

@app.route("/", methods=["GET", "POST"])
def index():
    seats, error, rows, cols = None, None, 3, 3
    if request.method == "POST":
        names = request.form.getlist("name[]")
        groups = request.form.getlist("group[]")
        students = [(n, g) for n, g in zip(names, groups) if n.strip() != ""]
        
        try:
            rows = int(request.form.get("rows", 3))
            cols = int(request.form.get("cols", 3))
        except ValueError:
            pass
            
        if len(students) < 2:
            error = "Minimum 2 students required to generate a seating plan."
        else:
            grid = [[None for _ in range(cols)] for _ in range(rows)]
            if solve_with_gaps(grid, students):
                seats = grid
            else:
                error = "Could not arrange perfectly without adjacent groups. Try manually increasing the grid dimensions."
                
    return render_template("index.html", seats=seats, error=error, rows=rows, cols=cols)

if __name__ == "__main__":
    app.run(debug=True)
