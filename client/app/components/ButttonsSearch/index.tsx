interface ButtonsSearchProps {
  matches: string[];
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  activeIndex: number;
}
export const ButtonsSearch: React.FC<ButtonsSearchProps> = ({
  matches,
  setActiveIndex,
  activeIndex,
}) => {
  const goToPrevMatch = () => {
    if (matches.length === 0) return;

    setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };
  const goToNextMatch = () => {
    if (matches.length === 0) return;

    setActiveIndex((prev) => (prev + 1 < matches.length ? prev + 1 : prev));
  };
  return (
    <div>
      <button
        type="button"
        onClick={goToNextMatch}
        disabled={activeIndex === matches.length - 1}>
        ↓
      </button>
      <button
        type="button"
        onClick={goToPrevMatch}
        disabled={activeIndex === 0}>
        ↑
      </button>
    </div>
  );
};
