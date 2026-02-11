import { AckHandshake, AppStore, ClientsConected, FeedMessage } from "@/types/types";

//tipado del setter del estado que actualiza el appstore, cuando exportemos la funcion al contexto, ponemos en este espacio el setter y nos ahorramos poner la funcion entera alla
type AppStoreSetter = React.Dispatch<React.SetStateAction<AppStore>>;

export const uptadeInboxUser = (setter: AppStoreSetter, msg: FeedMessage) => {
  setter((prev) => {
    const order_id = msg.id.toString();
    const exists_order = prev.store.order.includes(order_id);
    const from_id = msg.fromId!;
    return {
      ...prev,
      store: {
        ...prev.store,
        byId: {
          ...prev.store.byId,
          [msg.id]: msg,
        },
        order: exists_order
          ? prev.store.order
          : [...prev.store.order, order_id],
      },
      inboxMeta: {
        ...prev.inboxMeta,
        [from_id]: {
          hasNewMessages: true,
          unreadCount:
            msg.scope === "private"
              ? (prev.inboxMeta[from_id]?.unreadCount ?? 0) + 1
              : (prev.inboxMeta[from_id]?.unreadCount ?? 0), // patron de inicio seguro, elprimer ? evalua si es undefined o null, los ?? siguientes evaluan el valor final, si es null o undefined el valor final es el que asignemos a la derecha
          lastMessageTimestamp: msg.timestamp,
        },
      },
      publicMeta:
        msg.scope === "public"
          ? {
              ...prev.publicMeta,
              hasNewMessages: true,
              unreadCount: (prev.publicMeta?.unreadCount ?? 0) + 1,
            }
          : prev.publicMeta,
    };
  });
};
//Esta funcion esta pensada en principio para desacoplar logica del contexto a donde seteariamos constantemente informacion al AppStore.
//La vamos a llamar dentro del controller de eventos del socket, pasandole por parametros el setter del AppStore y el mensaje que recibimos del socket ya normalizado.
//Una vez aca vamos a ir extrayendo informacion del mensaje para actualizar el AppStore en el setter.
//Para llevar a cabo esta funcion, tenemos que ir bajando en los niveles del AppStore utilizando la funcion prev.
//Solo manejanmos el ingreso de mensajes publicos y privados a la hora de actualizar el AppStore. Para el resto de eventos (msg system, ack de inicio, snapshots, etc) voy a crear otras funciones como esta, que es la primera que salio bien.

export const uptadeInboxSystem = (msg: FeedMessage, setter: AppStoreSetter) => {
  setter((prev) => {
    const id_order = msg.id.toString();
    const exists_order = prev.store.order.includes(id_order);
    return {
      ...prev,
      store: {
        ...prev.store,
        byId: {
          ...prev.store.byId,
          [msg.id]: msg,
        },
        order: {
          ...prev.store.order,
        },
      },
    };
  });
};

export const updateDataUser = (msg: AckHandshake, setter: AppStoreSetter) => {
  setter((prev) => ({
 ...prev,
    userData: {
      isAlive: true,
      nickname: msg.payload.nickname,
      userId: msg.payload.id,
    },
  }));
};

export const updateDataSnapshot = (msg: ClientsConected[], setter: AppStoreSetter) => {
  setter((prev) => {
    return {
      ...prev,
      clients: msg,
    }
  })
}