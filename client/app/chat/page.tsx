"use client";
import { useEffect} from "react";
import { useAppContextWs } from "@/context/context";
import { DirectorySection } from "@/app/components/DirectorySection/index";
import { NavbarChat } from "@/app/components/NavbarChat/index";
import { FeedSection } from "@/app/components/FeedComponent/index";
import { resolve_request_me } from "@/helpers/me";
import { User } from "@/types/types";
import { useRouter } from "next/navigation";

export default function Chat() {
  const { user, setUser, active } = useAppContextWs();
  const router = useRouter();
  const veryfy_user = async () => {
    try {
      const user_refresh: User = await resolve_request_me();

      if (user_refresh !== null) {
        setUser(user_refresh);
      }
    } catch (error) {
      router.push("/");
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) return; //verifico si usuario es diferente a null quiere decir que posee datos, no necesitamos verificarlos con /me y corto la ejecucion del efecto

    veryfy_user();
  }, [user]);

  return (
    <main className={`h-dvh overflow-hidden grid grid-cols-1 grid-rows-[40px_40px_1fr] md:grid-rows-1
    ${active 
    ? `md:grid-cols-[236px_1fr_240px]`
    :`md:grid-cols-[236px_1fr_60px]`}`}>
      <DirectorySection />
      <FeedSection />
      <NavbarChat />
    </main>
  );
}
