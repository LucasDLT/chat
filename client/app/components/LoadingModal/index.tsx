import { ModalProps } from "@/types/types";

export const LoadingModal: React.FC<ModalProps> = ({ message }) => {
  return (
    <div className="bg-[#5d4a20eb] gap-2 z-100 text-center absolute bottom-40">
      <p className="p-0.5 mesoninaRegular text-black font-bold tracking-widest text-[16px]">{message}</p>
    </div>
  );
};