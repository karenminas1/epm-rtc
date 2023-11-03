import { useState, useCallback, useEffect } from "react";
import {
  fetchEventSource,
  EventStreamContentType,
} from "@microsoft/fetch-event-source";
import { Message } from "@/app/types";

interface EventStreamState {
  message: Message | "";
  isConnected: boolean;
  error: Error | null;
}

interface FetchEvent {
  (messages: Message[]): void;
}

export const useEventStream = (
  url: string
): EventStreamState & { fetchEvent: FetchEvent } => {
  const [state, setState] = useState<EventStreamState>({
    message: "",
    isConnected: false,
    error: null,
  });

  let abortController: AbortController;
  const fetchEvent: FetchEvent = useCallback(
    (messages: Message[]) => {
      abortController = new AbortController();

      fetchEventSource(url, {
        method: "POST",
        signal: abortController.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
        async onopen(response) {
          const contenType = response.headers.get("content-type");

          if (!!contenType && contenType.indexOf("application/json") >= 0) {
            throw await response.json();
          }

          if (
            response.ok &&
            response.headers
              .get("content-type")
              ?.startsWith(EventStreamContentType)
          ) {
            setState((prevState) => ({ ...prevState, isConnected: true }));
          } else {
            setState((prevState) => ({
              ...prevState,
              error: new Error("Stream opening failed"),
            }));
          }
        },
        onmessage(event) {
          if (!event) {
            return;
          }
          try {
            const message: Message = JSON.parse(event.data);
            setState((prevState) => ({
              ...prevState,
              message: message,
            }));
          } catch (error) {
            setState((prevState) => ({ ...prevState, error: error as Error }));
          }
        },
        onclose() {
          setState((prevState) => ({
            ...prevState,
            isConnected: false,
            error: new Error("Stream closed by server"),
          }));
        },
        onerror(error) {
          if (!!error) {
            setState((prevState) => ({
              ...prevState,
              error: error instanceof Error ? error : new Error(String(error)),
            }));
          }

          throw new Error(String(error));
        },
      });
    },
    [url]
  );

  useEffect(() => {
    return () => {
      abortController?.abort();
    };
  }, []);

  return { ...state, fetchEvent };
};

export default useEventStream;
