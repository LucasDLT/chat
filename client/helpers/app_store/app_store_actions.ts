import { AppStore, FeedMessage } from "@/types/types";

//tipado del setter del estado que actualiza el appstore, cuando exportemos la funcion al contexto, ponemos en este espacio el setter y nos ahorramos poner la funcion entera alla
type AppStoreSetter = React.Dispatch<React.SetStateAction<AppStore>>;

export const uptadeInboxUser = (setter: AppStoreSetter, msg: FeedMessage) => {
  setter((prev) => {
    const order_id = msg.id.toString();
    const exists_order = prev.store.order.includes(order_id)
    const from_id = msg.fromId!
    return {
      ...prev,
      store: {
        ...prev.store,
        byId: {
          ...prev.store.byId,
          [msg.id]: msg,
        },
        order:  exists_order 
        ? prev.store.order 
        :[...prev.store.order, order_id],
      },
      inboxMeta:{
        ...prev.inboxMeta,
        [from_id]:{
            hasNewMessages:true,
            unreadCount: msg.scope === "private" 
            ? (prev.inboxMeta[from_id]?.unreadCount ?? 0) + 1 
            :  prev.inboxMeta[from_id]?.unreadCount ?? 0, // patron de inicio seguro, elprimer ? evalua si es undefined o null, los ?? siguientes evaluan el valor final, si es null o undefined el valor final es el que asignemos a la derecha
            lastMessageTimestamp: msg.timestamp
        }
      },
      publicMeta: msg.scope === "public"
      ?{
        ...prev.publicMeta,
        hasNewMessages: true,
        unreadCount: (prev.publicMeta?.unreadCount ?? 0) + 1
      }
      : prev.publicMeta
    };
  });
};
