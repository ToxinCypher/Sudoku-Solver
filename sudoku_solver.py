class SudokuSolver:
    def __init__(self, grid):
        self.grid = grid
        self.size = 9

    def print_grid(self):
        """Print the Sudoku grid in a readable format"""
        for i in range(self.size):
            if i % 3 == 0 and i != 0:
                print("- - - - - - - - - - - -")

            for j in range(self.size):
                if j % 3 == 0 and j != 0:
                    print(" | ", end="")

                if j == 8:
                    print(self.grid[i][j])
                else:
                    print(str(self.grid[i][j]) + " ", end="")

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

def input_puzzle():
    """Allow user to input their own Sudoku puzzle"""
    print("Enter your Sudoku puzzle row by row.")
    print("Use 0 for empty cells.")
    print("Separate numbers with spaces.")

    puzzle = []
    for i in range(9):
        while True:
            try:
                row = input(f"Row {i+1}: ").split()
                row = [int(x) for x in row]

                if len(row) != 9:
                    print("Please enter exactly 9 numbers.")
                    continue

                if any(x < 0 or x > 9 for x in row):
                    print("Numbers must be between 0 and 9.")
                    continue

                puzzle.append(row)
                break
            except ValueError:
                print("Please enter valid integers separated by spaces.")

    return puzzle

def main():
    print("Sudoku Solver")
    print("=" * 20)

    # Ask user if they want to use the example or input their own
    choice = input("Do you want to use the example puzzle? (y/n): ").lower().strip()

    if choice == 'n' or choice == 'no':
        puzzle = input_puzzle()
    else:
        # Example Sudoku puzzle (0 represents empty cells)
        puzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ]
        print("Using example puzzle...")

    print("\nOriginal Sudoku puzzle:")
    solver = SudokuSolver(puzzle)
    solver.print_grid()

    print("\nSolving...\n")

    if solver.solve():
        print("Solved Sudoku puzzle:")
        solver.print_grid()
    else:
        print("No solution exists for this puzzle.")

if __name__ == "__main__":
    main()