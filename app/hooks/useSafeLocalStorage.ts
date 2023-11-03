import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { isWithinSizeLimit } from "@/app/utils";

const defaultLimit: number = 5 * 1024 * 1024;

export function useSafeLocalStorage<T>(
  key: string,
  initialValue: T,
  limit: number = defaultLimit,
  autoDelete: boolean = false
): [T, (value: T | ((val: T) => T)) => void, () => T, () => void, boolean] {
  const [storedValue, setStoredValue, removeValue, getStoredValue] =
    useLocalStorage<T>(key, initialValue);
  const [isSafeToSave, setIsSafeToSave] = useState<boolean>(true);

  const setSafeValue = (value: T | ((val: T) => T)): void => {
    const newValue = value instanceof Function ? value(storedValue) : value;

    if (isWithinSizeLimit(key, newValue, limit)) {
      setStoredValue(newValue);
      setIsSafeToSave(true);
    } else {
      if (autoDelete) {
        removeValue();
        setStoredValue(newValue);
        setIsSafeToSave(true);
      } else {
        console.warn("LocalStorage size limit exceeded.");
        setIsSafeToSave(false);
      }
    }
  };

  return [storedValue, setSafeValue, getStoredValue, removeValue, isSafeToSave];
}
