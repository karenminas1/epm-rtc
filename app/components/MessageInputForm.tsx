"use client";
import { ChangeEvent, FC, FormEvent, useState } from "react";

interface MessageInputFormProps {
  answerIsPending: boolean;
  onSendMessage: (message: string) => void;
}

const MessageInputForm: FC<MessageInputFormProps> = ({
  answerIsPending,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!newMessage.trim()) return;
    setNewMessage("");
    onSendMessage(newMessage);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      {answerIsPending ? (
        <input
          type="text"
          value="Waiting answer..."
          disabled={true}
          className="flex-1 p-2.5 border border-gray-200 rounded w-full bg-gray-200"
        />
      ) : (
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-2.5 border border-gray-200 rounded w-full"
        />
      )}
      <button
        type="submit"
        disabled={!newMessage.trim() || answerIsPending}
        className="bg-blue-600 text-white p-2.5 rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInputForm;
