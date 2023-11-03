import { GameOfLifeData, Matrix } from "../types";

export function gameOfLife({ matrix, iterations }: GameOfLifeData): Matrix {
  let currentGrid = matrix;

  for (let it = 0; it < iterations; it++) {
    let nextGrid: Matrix = currentGrid.map((row, x) =>
      row.map((cell, y) => {
        const liveNeighbors = getLiveNeighborCount(currentGrid, x, y);
        if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) return 0;
        if (cell === 0 && liveNeighbors === 3) return 1;
        return cell;
      })
    );

    currentGrid = nextGrid;
  }

  return currentGrid;
}

function getLiveNeighborCount(grid: Matrix, x: number, y: number): number {
  let liveNeighbors = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx,
        ny = y + dy;
      if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
        liveNeighbors += grid[nx][ny];
      }
    }
  }
  return liveNeighbors;
}

export function parseGameOfLifeResponse(input: string): GameOfLifeData | null {
  const regex = /```([\s\S]*?)```[\s\S]*?(\d+)/;
  const matches = input.match(regex);

  if (!matches) return null;

  const matrixString = matches[1].trim();
  const iterations = parseInt(matches[2]);

  const matrix: Matrix = matrixString
    .trim()
    .split("\n")
    .map((row) =>
      row
        .trim()
        .split("")
        .map((num) => parseInt(num))
    );

  return {
    matrix,
    iterations,
  };
}

export function isMatrixFormat(str: string) {
  const regex = /```([\s\S]*?)```[\s\S]*?(\d+)/;
  return str.match(regex);
}
