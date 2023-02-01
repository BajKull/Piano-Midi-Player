import { useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const v = value instanceof Function ? value(storedValue) : value;
    setStoredValue(v);
    if (typeof window === "undefined") return initialValue;
    window.localStorage.setItem(key, JSON.stringify(v));
  };

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
