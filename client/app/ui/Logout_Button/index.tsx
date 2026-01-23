import { resolve_logout } from "@/helpers/logout";

export const Logout_Button = () => {
  return (
    <button
      className="z-100 relative right-90 hover:cursor-pointer"
      onClick={() => {
        resolve_logout();
      }}
    >
      cerrar sesion
    </button>
  );
};
