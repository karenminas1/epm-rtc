import { useRef, useEffect, FC } from "react";

import { Matrix } from "@/app/types";

export const MatrixCanvas: FC<{ matrix: Matrix }> = ({ matrix }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      const cellSize = 12;
      matrix.forEach((row, y) => {
        row.forEach((cell, x) => {
          context.fillStyle = cell === 1 ? "black" : "white";
          context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        });
      });
    }
  }, [matrix]);

  const canvasStyle = {
    border: "1px solid black",
  };

  return (
    <canvas ref={canvasRef} width={300} height={300} style={canvasStyle} />
  );
};

export default MatrixCanvas;
