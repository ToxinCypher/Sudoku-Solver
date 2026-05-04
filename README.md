# Sudoku Solver App

A web-based Sudoku solver with HTML/CSS/JavaScript frontend. The solver runs entirely in the browser with no backend required.

## Features

- Interactive Sudoku board
- Custom puzzle input
- Example puzzle loading
- Client-side solver using backtracking algorithm
- Clean, responsive UI

## Installation

1. Simply open `index.html` in your browser to use the application

## Usage

1. Fill in the Sudoku puzzle:
   - Use the number inputs to enter known values
   - Leave empty cells as 0 or blank
   - Or click "Load Example" to use a sample puzzle

2. Click "Solve Puzzle" to solve the Sudoku

3. The solution will be displayed on the board

4. Use "Reset Puzzle" to clear the solution and start over

## Files

- `index.html`: Main HTML file
- `style.css`: Styling for the application
- `script.js`: Frontend JavaScript logic with solving algorithm
- `README.md`: This file

## Algorithm

The solver uses a backtracking algorithm:
1. Find an empty cell
2. Try numbers 1-9 in that cell
3. Check if the number is valid according to Sudoku rules
4. If valid, recursively solve the rest of the puzzle
5. If no solution found, backtrack and try the next number
6. If all numbers have been tried and none work, trigger backtracking

## Running the Application

Just open `index.html` in any modern web browser. No internet connection or server required after the initial load.