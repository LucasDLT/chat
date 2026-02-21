"use client";
import { useAppContextWs } from "@/context/context";

export const ButtonsSearch = () => {

  const { appStore, setAppStore } = useAppContextWs();
const goToPrevMatch = () => {
  setAppStore((prev) => {
    const { matches, activeIndex } = prev.store.local;

    if (matches.length === 0) return prev;

    const newIndex = Math.max(activeIndex - 1, 0);

    return {
      ...prev,
      store: {
        ...prev.store,
        local: {
          ...prev.store.local,
          activeIndex: newIndex,
        },
      },
    };
  });
};
const goToNextMatch = () => {
  setAppStore((prev) => {
    const { matches, activeIndex } = prev.store.local;

    if (matches.length === 0) return prev;

    const newIndex = Math.min(activeIndex + 1, matches.length - 1);

    return {
      ...prev,
      store: {
        ...prev.store,
        local: {
          ...prev.store.local,
          activeIndex: newIndex,
        },
      },
    };
  });
};
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={goToNextMatch}
        disabled={appStore.store.local.activeIndex === appStore.store.local.matches.length - 1}>
        ↓
      </button>
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={goToPrevMatch}
        disabled={appStore.store.local.activeIndex === 0}>
        ↑
      </button>
    </div>
  );
};
