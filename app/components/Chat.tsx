"use client";
import { useState, useCallback, FC, useRef, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  useGameWorker,
  useEventStream,
  useSafeLocalStorage,
} from "@/app/hooks";
import { Message } from "@/app/types";
import { Roles } from "@/app/enums";
import ChatMessage from "./ChatMessage";
import MessageInputForm from "./MessageInputForm";

const Chat: FC = () => {
  const [storageMessage, setStorageMessages] = useSafeLocalStorage<Message[]>(
    "messages",
    []
  );
  const { message: aiResponse, fetchEvent } = useEventStream("/api/sse");
  const [messages, setMessages] = useState<Message[]>([]);
  const [answerIsPending, setAnswerIsPending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestMessages = useRef<Message[]>(storageMessage);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleWorkerMessage = useCallback((newMessage: Message) => {
    setStorageMessages([...latestMessages.current, newMessage]);
  }, []);

  const { sendMatrixToWorker } = useGameWorker(handleWorkerMessage);

  useEffect(() => {
    latestMessages.current = storageMessage;
    setMessages(storageMessage);
    scrollToBottom();
  }, [setStorageMessages]);

  useEffect(() => {
    if (aiResponse) {
      setStorageMessages(() => [...latestMessages.current, aiResponse]);

      if (
        aiResponse.role === Roles.Assistant &&
        aiResponse.type === undefined
      ) {
        sendMatrixToWorker(aiResponse.content);
      }
      setAnswerIsPending(false);
    }
  }, [aiResponse]);

  const onSendMessage = useCallback((message: string) => {
    setAnswerIsPending(true);

    const newMessage: Message = {
      id: uuidv4(),
      content: message,
      role: Roles.User,
    };

    latestMessages.current = [...latestMessages.current, newMessage];
    setStorageMessages(latestMessages.current);

    fetchEvent(latestMessages.current);
  }, []);

  return (
    <div className="max-w-md mx-auto p-5 border border-gray-300 rounded">
      <div className="chat-messages overflow-auto h-96">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInputForm
        answerIsPending={answerIsPending}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default Chat;
