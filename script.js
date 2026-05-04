document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('sudoku-board');
    const solveBtn = document.getElementById('solveBtn');
    const resetBtn = document.getElementById('resetBtn');
    const loadExampleBtn = document.getElementById('loadExample');
    const clearBoardBtn = document.getElementById('clearBoard');
    const messageDiv = document.getElementById('message');

    // Create the Sudoku board
    function createBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.max = '9';
                input.dataset.row = i;
                input.dataset.col = j;

                // Add some styling for the 3x3 boxes
                if (i % 3 === 0 && i !== 0) {
                    cell.style.borderTop = '2px solid #333';
                }
                if (j % 3 === 0 && j !== 0) {
                    cell.style.borderLeft = '2px solid #333';
                }

                cell.appendChild(input);
                row.appendChild(cell);
            }
            board.appendChild(row);
        }
    }

    // Load example puzzle
    function loadExample() {
        const examplePuzzle = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];

        const inputs = document.querySelectorAll('#sudoku-board input');
        inputs.forEach(input => {
            const row = parseInt(input.dataset.row);
            const col = parseInt(input.dataset.col);
            input.value = examplePuzzle[row][col] === 0 ? '' : examplePuzzle[row][col];
        });

        showMessage('Example puzzle loaded!', 'success');
    }

    // Clear the board
    function clearBoard() {
        const inputs = document.querySelectorAll('#sudoku-board input');
        inputs.forEach(input => {
            input.value = '';
        });
        showMessage('', '');
    }

    // Get the current puzzle from the board
    function getPuzzleFromBoard() {
        const puzzle = [];
        const inputs = document.querySelectorAll('#sudoku-board input');

        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                const value = inputs[i * 9 + j].value;
                row.push(value === '' ? 0 : parseInt(value));
            }
            puzzle.push(row);
        }

        return puzzle;
    }

    // Display the solved puzzle on the board
    function displaySolution(solution) {
        const inputs = document.querySelectorAll('#sudoku-board input');
        inputs.forEach((input, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            input.value = solution[row][col];

            // Disable input for solved cells
            if (solution[row][col] !== 0) {
                input.disabled = true;
            }
        });
    }

    // Show message to the user
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
    }

    // Validate the puzzle before solving
    function validatePuzzle(puzzle) {
        // Check if all values are valid (0-9)
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const value = puzzle[i][j];
                if (isNaN(value) || value < 0 || value > 9) {
                    return false;
                }
            }
        }
        return true;
    }

    // Check if placing num at grid[row][col] is valid
    function isValid(grid, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) {
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (grid[x][col] === num) {
                return false;
            }
        }

        // Check 3x3 box
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    // Solve the Sudoku puzzle using backtracking
    function solveSudoku(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                // Find an empty cell
                if (grid[row][col] === 0) {
                    // Try placing numbers 1-9
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;

                            // Recursively solve the rest
                            if (solveSudoku(grid)) {
                                return true;
                            }

                            // If no solution found, backtrack
                            grid[row][col] = 0;
                        }
                    }

                    // Trigger backtracking
                    return false;
                }
            }
        }

        // Puzzle solved
        return true;
    }

    // Solve the puzzle directly in the browser
    function solvePuzzle() {
        const puzzle = getPuzzleFromBoard();

        if (!validatePuzzle(puzzle)) {
            showMessage('Invalid input! Please use numbers 0-9 only.', 'error');
            return;
        }

        showMessage('Solving...', '');

        // Create a deep copy of the puzzle for solving
        const puzzleCopy = puzzle.map(row => [...row]);

        // Attempt to solve
        if (solveSudoku(puzzleCopy)) {
            displaySolution(puzzleCopy);
            showMessage('Puzzle solved successfully!', 'success');
        } else {
            showMessage('No solution exists for this puzzle.', 'error');
        }
    }

    // Reset the puzzle to its original state
    function resetPuzzle() {
        const inputs = document.querySelectorAll('#sudoku-board input');
        inputs.forEach(input => {
            input.disabled = false;
        });
        showMessage('', '');
    }

    // Event listeners
    solveBtn.addEventListener('click', solvePuzzle);
    resetBtn.addEventListener('click', resetPuzzle);
    loadExampleBtn.addEventListener('click', loadExample);
    clearBoardBtn.addEventListener('click', clearBoard);

    // Initialize the board
    createBoard();
});