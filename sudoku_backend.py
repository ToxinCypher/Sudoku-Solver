from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

class SudokuSolver:
    def __init__(self, grid):
        self.grid = grid
        self.size = 9

    def is_valid(self, row, col, num):
        """Check if placing num at grid[row][col] is valid"""
        # Check row
        for x in range(self.size):
            if self.grid[row][x] == num:
                return False

        # Check column
        for x in range(self.size):
            if self.grid[x][col] == num:
                return False

        # Check 3x3 box
        start_row = row - row % 3
        start_col = col - col % 3
        for i in range(3):
            for j in range(3):
                if self.grid[i + start_row][j + start_col] == num:
                    return False

        return True

    def solve(self):
        """Solve the Sudoku puzzle using backtracking"""
        for row in range(self.size):
            for col in range(self.size):
                # Find an empty cell
                if self.grid[row][col] == 0:
                    # Try placing numbers 1-9
                    for num in range(1, 10):
                        if self.is_valid(row, col, num):
                            self.grid[row][col] = num

                            # Recursively solve the rest
                            if self.solve():
                                return True

                            # If no solution found, backtrack
                            self.grid[row][col] = 0

                    # Trigger backtracking
                    return False

        # Puzzle solved
        return True

@app.route('/solve', methods=['POST'])
def solve_sudoku():
    try:
        # Parse JSON data
        data = request.get_data(as_text=True)
        puzzle_data = json.loads(data)
        puzzle = puzzle_data.get('puzzle', [])

        # Validate puzzle format
        if not isinstance(puzzle, list) or len(puzzle) != 9:
            return jsonify({'error': 'Invalid puzzle format'}), 400

        for row in puzzle:
            if not isinstance(row, list) or len(row) != 9:
                return jsonify({'error': 'Invalid puzzle format'}), 400

        # Create solver instance
        solver = SudokuSolver([row[:] for row in puzzle])  # Deep copy

        # Attempt to solve
        if solver.solve():
            return jsonify({
                'solution': solver.grid,
                'status': 'solved'
            })
        else:
            return jsonify({
                'solution': None,
                'status': 'no_solution'
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)