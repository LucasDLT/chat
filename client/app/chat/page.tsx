"use client";
import { useEffect} from "react";
import { useAppContextWs } from "@/context/context";
import { DirectorySection } from "@/app/components/DirectorySection/index";
import { NavbarChat } from "@/app/components/NavbarChat/index";
import { FeedSection } from "@/app/components/FeedComponent/index";
import { resolve_request_me } from "@/helpers/me";
import { User } from "@/types/types";

export default function Chat() {
  const { user, setUser } = useAppContextWs();

  const veryfy_user = async () => {
    try {
      const user_refresh: User = await resolve_request_me();
      console.log(user_refresh, "en verify");

      if (user_refresh !== null) {
        setUser(user_refresh);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) return; //verifico si usuario es diferente a null quiere decir que posee datos, no necesitamos verificarlos con /me y corto la ejecucion del efecto

    veryfy_user();
  }, [user]);

  return (
    <main className="h-dvh grid grid-rows-[30px_1fr_50px]  md:grid-cols-[236px_1fr_60px] border">
      <DirectorySection />
      <FeedSection />
      <NavbarChat />
    </main>
  );
}
