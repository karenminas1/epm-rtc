import { useState, useCallback, useRef, useEffect } from "react";
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEvent: FetchEvent = useCallback(
    (messages: Message[]) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      fetchEventSource(url, {
        method: "POST",
        signal: abortControllerRef.current.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
        async onopen(response) {
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
          setState((prevState) => ({
            ...prevState,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
        },
      });
    },
    [url]
  );

  useEffect(() => {
    const abortController = abortControllerRef.current;
    return () => {
      abortController?.abort();
    };
  }, []);

  return { ...state, fetchEvent };
};

export default useEventStream;
