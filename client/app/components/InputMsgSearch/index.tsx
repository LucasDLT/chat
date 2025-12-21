import { ChangeEvent } from "react";
import Image from "next/image";
import {ButtonsSearch} from "@/app/components/ButttonsSearch"

interface InputMsgSearchProps {
onChange: (e:ChangeEvent<HTMLInputElement>) => void;
inputMsgSearch: string | undefined;
handleSearchMsg:(e: React.FormEvent<HTMLFormElement>) => void;

//props para los buttons
activeIndex:number
matches:string[];
setActiveIndex:React.Dispatch<React.SetStateAction<number>>;
}

export const InputMsgSearch:React.FC<InputMsgSearchProps> = ({onChange, inputMsgSearch, handleSearchMsg, activeIndex, matches, setActiveIndex}) => {
  return (
    <form
      className={`z-11 top-36 justify-between right-6 w-40 items-center xl:w-56 xl:h-9 flex absolute xl:right-78 xl:top-[5.6px]`}
      onSubmit={handleSearchMsg}
    >
      
      <input
        onChange={onChange}
        type="text"
        className=" yellowBg h-6 rounded-xs text-black text-center w-34 xl:w-45 xl:h-7"
        value={inputMsgSearch? inputMsgSearch : ""}
      />
     { !inputMsgSearch ? (<Image
        alt="icon lupa"
        src={"/icons/lupa.png"}
        width={30}
        height={30}
        className="p-1 rounded-xs object-cover h-5 w-5 "
      />) :(
      <ButtonsSearch activeIndex={activeIndex} matches={matches} 
      setActiveIndex={setActiveIndex} />)
      }
    </form>
  );
};
