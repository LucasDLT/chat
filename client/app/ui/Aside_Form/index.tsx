import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface Aside_Message_Props {
  router: AppRouterInstance;
}
export const Aside_Message: React.FC<Aside_Message_Props> = ({ router }) => {
  const google_endpoint = process.env.NEXT_PUBLIC_WS_INITCALLBACK;
  return (
    <aside>
      <a href={google_endpoint}>iniciar con Google?</a>
      <p>¿aun no estas registrado?</p>
      <div>
        <button onClick={() => router.push("/login")}>¿crear cuenta?</button>
      </div>
    </aside>
  );
};
