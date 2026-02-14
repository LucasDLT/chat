import {
  AckHandshake,
  AppStore,
  ClientsConected,
  FeedMessage,
} from "@/types/types";

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
        order: exists_order
          ? prev.store.order
          : [...prev.store.order, id_order],
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

export const updateDataSnapshot = (
  msg: ClientsConected[],
  setter: AppStoreSetter,
) => {
  setter((prev) => {
    return {
      ...prev,
      clients: msg,
    };
  });
};

//HANDLE PARA INTEGRAR DENTRO DEL HANDLESELECTCLIENT

export const handleUpdatePrivateData = (
  normalized_msg: FeedMessage[],
  prev: AppStore,
  userId: number,
): AppStore => {
  const newById = { ...prev.store.byId };
  const newOrder = [...prev.store.order];

  const newHasMore = normalized_msg.length === prev.store.remote.limit; //cuando devuelva menos que limit es que ya no quedan mensajes en la bdd

  const newOffset = normalized_msg.length + prev.store.remote.offset;

  normalized_msg.forEach((msg) => {
    newById[msg.id] = msg;

    if (!newOrder.includes(msg.id.toString())) {
      newOrder.push(msg.id.toString());
    }
  });

  return {
    ...prev,
    store: {
      ...prev.store,
      byId: newById,
      order: newOrder,
      remote: {
        ...prev.store.remote,
        offset: newOffset,
        hasMore: newHasMore,
      },
    },
    inboxMeta: {
      ...prev.inboxMeta,
      [userId]: {
        hasNewMessages: false,
        unreadCount: 0,
        lastMessageTimestamp: 0,
      },
    },
  };
};

//HANDLE PARA INTEGRAR DENTRO DEL HANDLESEARCHMSG

export const handleUpdateSearchMsgPriv = (
  query: string,
  prev: AppStore,
  normalized_msg: FeedMessage[],
): AppStore => {
  const new_buffer = { ...prev.store.local.searchBufferPrivate };
  const new_byId = { ...prev.store.byId };
  const new_order = [...prev.store.order];

  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;

    new_byId[msg.id] = msg;

    if (!new_order.includes(msg.id.toString())) {
      new_order.push(msg.id.toString());
    }
  });
  const new_matches = Object.values(new_buffer)
    .filter((m) => m.text.toLowerCase().includes(query))
    .map((m) => Number(m.id));

  const new_offset = prev.store.view.offset + prev.store.view.limit; //calculo el new_offset sumando el offset y el limit

  const new_hasMore = new_matches.length > new_offset; //calculo si la longitud de matches es mayor al new_offset

  return {
    ...prev,
    store: {
      ...prev.store,
      view: {
        ...prev.store.view,
        offset: new_offset,
      },
      feedMode: "local",
      local: {
        ...prev.store.local,
        searchBufferPrivate: new_buffer,
        matches: new_matches,
        activeIndex: 0,
        hasMore: new_hasMore,
      },
    },
  };
};

export const handleUpdateSearchMsgPublic = (
  query: string,
  prev: AppStore,
  normalized_msg: FeedMessage[],
): AppStore => {
  const new_buffer = { ...prev.store.local.searchBufferPublic };
  const new_byId = { ...prev.store.byId };
  const new_order = [...prev.store.order];

  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;

    new_byId[msg.id] = msg;

    if (!new_order.includes(msg.id.toString())) {
      new_order.push(msg.id.toString());
    }
  });
  const new_matches = Object.values(new_buffer)
    .filter((m) => m.text.toLowerCase().includes(query))
    .map((m) => Number(m.id));

  const new_offset = prev.store.view.offset + prev.store.view.limit; //calculo el new_offset sumando el offset y el limit

  const new_hasMore = new_matches.length > new_offset; //calculo si la longitud de matches es mayor al new_offset
  return {
    ...prev,
    store: {
      ...prev.store,
      byId: new_byId,
      order: new_order,
      view: {
        ...prev.store.view,
        offset: new_offset,
      },
      feedMode: "local",
      local: {
        ...prev.store.local,
        searchBufferPublic: new_buffer,
        matches: new_matches,
        activeIndex: 0,
        hasMore: new_hasMore,
      },
    },
  };
};

//FUNCION PARA RESETEAR PROPIEDADES AL CERRAR BUSQUEDA LOCAL Y CONSOLIDAR NUEVO FEED

export const handleConsiderNewFeed = (prev: AppStore): AppStore => {
  const order = [...prev.store.order];
  //aca hay que actualizar el order de la store y ademas el byId
  const consolidateOrder = order.slice(0, prev.store.view.offset);
  //hay que resetear las propiedades de busqueda local
  const currentById = { ...prev.store.byId };
  const newById: Record<string, FeedMessage> = {};
  consolidateOrder.forEach((id) => {
    newById[id] = currentById[id];
  })
  const new_offset = prev.store.view.offset
  return {
    ...prev,
    store: {
      ...prev.store,
      byId: newById,//aca agregar el byId consolidado
      order: consolidateOrder,
      feedMode: "remote",
      remote: {
        ...prev.store.remote,
        offset: new_offset,
        loading: false,
      },
      local: {
        ...prev.store.local,
        searchBufferPrivate: {},
        searchBufferPublic: {},
        matches: [],
        activeIndex: 0,
        hasMore: false,
      },
    },
  };
};

//FUNCION PARA ACTUALIZAR EN CADA SCROLL LAS PROPIEDADES DE BUSQUEDA LOCAL O REMOTE

export const handleUpdateView = (prev: AppStore): AppStore => {
  const new_offset = prev.store.view.offset + prev.store.view.limit;
  return {
    ...prev,
    store: {
      ...prev.store,
      view: {
        ...prev.store.view,
        offset: new_offset,
      },
    },
  };
};