import { GameOfLifeData } from "./app/types";
import { gameOfLife } from "./app/utils";

addEventListener("message", (event: MessageEvent<GameOfLifeData>) => {
  postMessage(gameOfLife(event.data));
});
