"use client";
import { useAppContextWs } from "@/context/context";
import {
  handleNewFeedPrivate,
  handleNewFeedPublic,
} from "@/helpers/app_store/app_store_actions";
export const ButtonsSearch = () => {
  const { appStore, setAppStore, setInputSearch, privateIdMsg } =
    useAppContextWs();
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
  const goToNextMatch = (event: React.FormEvent) => {
    event.preventDefault();
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
  const closeSearch = () => {
    if (appStore.store.feed.active === "public") setAppStore((prev) => handleNewFeedPublic(prev));

    if (appStore.store.feed.active === "private" && privateIdMsg) {
      const id = privateIdMsg.toString();
      setInputSearch("");
      setAppStore((prev) => handleNewFeedPrivate(prev, id));
    }
  };
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={goToNextMatch}
        disabled={
          appStore.store.local.activeIndex ===
          appStore.store.local.matches.length - 1
        }
      >
        ↓
      </button>
      <button
        className="hover:cursor-pointer"
        type="button"
        onClick={goToPrevMatch}
        disabled={appStore.store.local.activeIndex === 0}
      >
        ↑
      </button>
      <button type="button" onClick={closeSearch} className="hover:cursor-pointer">
        X
      </button>
    </div>
  );
};
