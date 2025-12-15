import { ChangeEvent } from "react";
import Image from "next/image";
import {ButtonsSearch} from "@/components/ButttonsSearch"

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
      className={`z-11 xl:w-56 xl:h-9 xl:flex xl:justify-center xl:items-center absolute xl:right-78 xl:top-[5.6px]`}
      onSubmit={handleSearchMsg}
    >
      
      <input
        onChange={onChange}
        type="text"
        className=" yellowBg h-6 rounded-xs text-black px-px text-center w-full mx-1 xl:w-45 xl:h-7"
        value={inputMsgSearch? inputMsgSearch : ""}
      />
     { !inputMsgSearch ? (<Image
        alt="icon user"
        src={"/icons/lupa.png"}
        width={30}
        height={30}
        className="p-1 rounded-xs object-cover h-6 w-6"
      />) :(
      <ButtonsSearch activeIndex={activeIndex} matches={matches} 
      setActiveIndex={setActiveIndex} />)
      }
    </form>
  );
};
