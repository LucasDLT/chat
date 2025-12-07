import Image from "next/image";
interface RegisterSectionProps {
  hasNickname: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onClick: () => void;
  activeRegister: boolean;
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  hasNickname,
  onChange,
  value,
  onSubmit,
  activeRegister,
  onClick,
}) => {
  return (
    <section className="flex flex-col justify-center items-center relative h-[60vh]">
      <Image
        height={300}
        width={500}
        alt="background register section"
        src={"/background-app.jpg"}
        className="h-full w-full object-cover xl:h-80 xl:rounded-sm xl:mt-10 xl:mb-10 "
      />

      {activeRegister ? (
          <form
          className="flex flex-col g-1 justify-center items-center backdrop-blur-[2px] absolute h-50 w-60 rounded-sm border borderYellow gap-4"
          onSubmit={onSubmit}
          >
          <button type="button" onClick={onClick} className="flex justify-end items-end absolute right-1 top-1 px-2 bgBlurYellow rounded text-gray-200 border borderYellow hover:cursor-pointer">x</button>
          <label className="mesoninaRegular font-bold tracking-wider text-3xl">
            Nombre
          </label>
          <input
            type="text"
            className="bgBlurYellow rounded"
            onChange={onChange}
            value={value}
          />
          <button type="submit" className="border  borderYellow rounded p-1 m-1 mesoninaRegular tracking-widest font-extrabold text-[15px] hover:cursor-pointer borderYellow">
            {hasNickname ? "cambiar" : "registrar"}
          </button>
          <p className="titleColor mesoninaRegular font-bold tracking-widest">Ya casi terminas</p>
        </form>
        
      ) : (
        <button
          onClick={onClick}
          className=" text-center w-28 rounded p-2 m-1 absolute text-black bg-yellow-200/60 backdrop-blur-[1px] hover:cursor-pointer mesoninaRegular font-extrabold tracking-[5px]"
        >
          INGRESAR
        </button>
      )}
    </section>
  );
};
