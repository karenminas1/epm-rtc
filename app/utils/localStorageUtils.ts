const defaultLimit: number = 5 * 1024 * 1024;

export const calculateStorageSize = (): number => {
  let total = 0;
  if (typeof window !== "undefined") {
    for (let key in window.localStorage) {
      const storedItem = window.localStorage.getItem(key);
      if (storedItem) {
        total += (storedItem.length + key.length) * 2;
      }
    }
  }
  return total;
};

export const isWithinSizeLimit = (
  key: string,
  newValue: unknown,
  limit: number = defaultLimit
): boolean => {
  if (typeof window === "undefined") return false;

  const currentSize = calculateStorageSize();
  const valueSize =
    typeof newValue === "string"
      ? newValue.length
      : JSON.stringify(newValue).length;
  return currentSize + (key.length + valueSize) * 2 <= limit;
};
