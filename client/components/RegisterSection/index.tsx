import Image from "next/image";

interface RegisterSectionProps {
    hasNickname:boolean,
    onSubmit:(e: React.FormEvent<HTMLFormElement>)=>void
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
    value:string
}

export const RegisterSection:React.FC<RegisterSectionProps> = ({hasNickname,onChange,value,onSubmit}) => {
  return (
    <section className="flex flex-col justify-center items-center relative">
      <Image
        height={300}
        width={500}        
        alt="background registe section"
        src={"/background-app.jpg"}
        className="rounded-sm mt-10"
      />
      <form className="flex flex-col g-1 justify-center items-center bg-gray-950/80 absolute"
      onSubmit={onSubmit}>
        <label className="mesoninaRegular font-bold tracking-wider text-2xl">Nick</label>
        <input type="text" className="border border-amber-100" onChange={onChange}
          value={value}/>
        <button className="border rounded p-1 m-1 ">
          {hasNickname ? "cambiar nick" : "registrar nick"}
        </button>
      </form>
    </section>
  );
};
