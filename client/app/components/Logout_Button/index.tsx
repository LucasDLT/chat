import { resolve_logout } from "@/helpers/forms/logout";
import { useAppContextWs } from "@/context/context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const Logout_Button = () => {
  const { setActiveUser, setUser } = useAppContextWs();
  const router = useRouter();
  return (
    <button
      className="z-100 hover:cursor-pointer"
      onClick={() => {
        resolve_logout();
        setActiveUser(false);
        setUser(null);
        router.push("/");
      }}
    >
      <Image
        src="/icons/logout.png"
        alt="logout"
        width={25}
        height={25}
      />
    </button>
  );
};
