import { resolve_logout } from "@/helpers/forms/logout";
import { useAppContextWs } from "@/context/context";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const Logout_Button = () => {
  const { setActiveUser, setUser } = useAppContextWs();
  const router = useRouter();
  return (
    <button
      className="hover:cursor-pointer flex justify-center items-center"
      onClick={() => {
        resolve_logout();
        setActiveUser(false);
        setUser(null);
        router.push("/");
      }}
    >
      <Image
        src="/icons/logoutminimal.png"
        alt="logout"
        width={28}
        height={30}
        className="z-100"
      />
    </button>
  );
};
