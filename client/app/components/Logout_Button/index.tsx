import { resolve_logout } from "@/helpers/logout";
import { useAppContextWs } from "@/context/context";
import { useRouter } from "next/navigation";

export const Logout_Button = () => {
  const { setActiveUser } = useAppContextWs();
  const router = useRouter();
  return (
    <button
      className="z-100 text-blackhover:cursor-pointer"
      onClick={() => {
        resolve_logout();
        setActiveUser(false);
        router.push("/");
      }}
    >
      cerrar sesion
    </button>
  );
};
