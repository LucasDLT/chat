"use client";
import { useAppContextWs } from "@/context/context";

export const ButtonsSearch = () => {

  const { appStore, setAppStore } = useAppContextWs();
  const goToPrevMatch = () => {
    if (appStore.store.local.matches.length === 0) return;

    //setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));

    setAppStore((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        local: {
          ...prev.store.local,
          activeIndex: prev.store.local.activeIndex - 1 >= 0 ? prev.store.local.activeIndex - 1 : prev.store.local.activeIndex,
        },
      },
    }));
  };
  const goToNextMatch = () => {
    if (appStore.store.local.matches.length === 0) return;

   // setActiveIndex((prev) => (prev + 1 < matches.length ? prev + 1 : prev));

    setAppStore((prev) => ({
      ...prev,
      store: {
        ...prev.store,
        local: {
          ...prev.store.local,
          activeIndex: prev.store.local.activeIndex + 1 < prev.store.local.matches.length ? prev.store.local.activeIndex + 1 : prev.store.local.activeIndex,
        },
      },
    }));
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
