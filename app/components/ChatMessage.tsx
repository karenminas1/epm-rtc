import { FC } from "react";

import { Message } from "@/app/types";
import MatrixCanvas from "./MatrixCanvas";

const ChatMessage: FC<{ message: Message }> = ({ message }) => {
  return (
    <div className="my-1.5">
      <span className="font-bold mr-1.5">{message.role}: </span>
      {message.type === "canvas" ? (
        <div>
          <span className="mr-1.5">Below is the provided finishing state.</span>
          <MatrixCanvas matrix={JSON.parse(message.content)} />
        </div>
      ) : (
        <div>
          <span>{message.content}</span>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
