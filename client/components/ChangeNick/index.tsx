interface ChangeSectionProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
}

export const ChangeNickSection: React.FC<ChangeSectionProps> = ({
  onChange,
  value,
  onSubmit,
  name
}) => {
  return (
    <form
      className="flex flex-col g-1 justify-center items-center h-40 w-50 rounded-sm mt-4"
      onSubmit={onSubmit}
    >
      <label className="mesoninaRegular text-black font-bold tracking-wider text-xl">
        {name}
      </label>
      <input
        type="text"
        className="blackDegbg rounded text-black px-px m-1 text-center"
        onChange={onChange}
        value={value}
      />
      <button
        type="submit"
        className="text-black bg-gray-500/50 rounded px-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow"
      >
        guardar y cambiar
      </button>

    </form>
  );
};
