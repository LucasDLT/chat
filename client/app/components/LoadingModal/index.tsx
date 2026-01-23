import { ModalProps } from "@/types/types";

export const LoadingModal: React.FC<ModalProps> = ({ message }) => {
  return (
    <div className="bg-white z-100 rounded-full">
      <p className=" mesoninaRegular font-bold tracking-widest">{message}</p>
    </div>
  );
};