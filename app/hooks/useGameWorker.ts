import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { Matrix, Message } from "@/app/types";
import { isMatrixFormat, parseGameOfLifeResponse } from "@/app/utils";
import { Roles } from "@/app/enums";

export const useGameWorker = (onWorkerMessage: (message: Message) => void) => {
  const gameWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    gameWorkerRef.current = new Worker(
      new URL("../../worker.ts", import.meta.url)
    );
    gameWorkerRef.current.onmessage = (event: MessageEvent<Matrix>) => {
      const reqBody: Message = {
        id: uuidv4(),
        role: Roles.Assistant,
        content: JSON.stringify(event.data),
        type: "canvas",
      };
      onWorkerMessage(reqBody);
    };

    return () => {
      gameWorkerRef.current?.terminate();
    };
  }, [onWorkerMessage]);

  const sendMatrixToWorker = (data: string) => {
    if (isMatrixFormat(data)) {
      const parsedGameOfLifeResponse = parseGameOfLifeResponse(data);
      gameWorkerRef.current?.postMessage(parsedGameOfLifeResponse);
    }
  };

  return { sendMatrixToWorker };
};
