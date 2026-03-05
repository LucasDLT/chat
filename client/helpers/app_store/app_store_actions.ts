import {
  AckHandshake,
  AppStore,
  ClientsConected,
  FeedMessage,
} from "@/types/types";

//tipado del setter del estado que actualiza el appstore, cuando exportemos la funcion al contexto, ponemos en este espacio el setter y nos ahorramos poner la funcion entera alla
type AppStoreSetter = React.Dispatch<React.SetStateAction<AppStore>>;

export const uptadeInboxPrivate = (
  setter: AppStoreSetter,
  msg: FeedMessage,
  id: string,
) => {
  setter((prev) => {
    const privateFeed = prev.store.feed.private[id];
    const safeFeed = privateFeed ?? {
      byId: {},
      order: [],
      searchBuffer: {},
      remote: { offset: 0, hasMore: false, loading: false },
    };

    const order_id = msg.id.toString();
    const exists_order = safeFeed.order.includes(order_id);

    const isOwnMessage = msg.fromId === prev.userData?.userId;
    const incrementUnread = !isOwnMessage; // tus propios mensajes no cuentan

    return {
      ...prev,
      store: {
        ...prev.store,
        feed: {
          ...prev.store.feed,
          private: {
            ...prev.store.feed.private,
            [id]: {
              ...safeFeed,
              byId: {
                ...safeFeed.byId,
                [msg.id]: msg,
              },
              order: exists_order
                ? [...safeFeed.order]
                : [...safeFeed.order, order_id],
            },
          },
        },
      },
      inboxMeta: {
        ...prev.inboxMeta,
        [id]: {
          hasNewMessages: incrementUnread,
          unreadCount: incrementUnread
            ? (prev.inboxMeta[id]?.unreadCount ?? 0) + 1
            : (prev.inboxMeta[id]?.unreadCount ?? 0),
          lastMessageTimestamp: msg.timestamp,
        },
      },
    };
  });
};

//Esta funcion esta pensada en principio para desacoplar logica del contexto a donde seteariamos constantemente informacion al AppStore.
//La vamos a llamar dentro del controller de eventos del socket, pasandole por parametros el setter del AppStore y el mensaje que recibimos del socket ya normalizado.
//Una vez aca vamos a ir extrayendo informacion del mensaje para actualizar el AppStore en el setter.
//Para llevar a cabo esta funcion, tenemos que ir bajando en los niveles del AppStore utilizando la funcion prev.
//Solo manejanmos el ingreso de mensajes publicos y privados a la hora de actualizar el AppStore. Para el resto de eventos (msg system, ack de inicio, snapshots, etc) voy a crear otras funciones como esta, que es la primera que salio bien.

export const uptadeInboxPublic = (setter: AppStoreSetter, msg: FeedMessage) => {
  setter((prev) => {
    const order_id = msg.id.toString();
    const exists_order = prev.store.feed.public.order.includes(order_id);
    return {
      ...prev,
      store: {
        ...prev.store,
        feed: {
          ...prev.store.feed,
          public: {
            ...prev.store.feed.public,
            byId: {
              ...prev.store.feed.public.byId,
              [msg.id]: msg,
            },
            order: exists_order
              ? prev.store.feed.public.order
              : [...prev.store.feed.public.order, order_id],
          },
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

export const uptadeInboxSystem = (msg: FeedMessage, setter: AppStoreSetter) => {
  setter((prev) => {
    const id_order = msg.id.toString();
    const exists_order = prev.store.feed.public.order.includes(id_order);
    return {
      ...prev,
      store: {
        ...prev.store,
        feed: {
          ...prev.store.feed,
          public: {
            ...prev.store.feed.public,
            byId: {
              ...prev.store.feed.public.byId,
              [msg.id]: msg,
            },
            order: exists_order
              ? prev.store.feed.public.order
              : [...prev.store.feed.public.order, id_order],
          },
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
  userId: string,
): AppStore => {
  const existingConversation = prev.store.feed.private[userId] ?? {
    byId: {},
    order: [],
    searchBuffer: {},
    remote: {
      offset: 0,
      hasMore: true,
      loading: false,
    },
  };

  const newById = { ...existingConversation.byId };
  const newOrder = [...existingConversation.order];

  normalized_msg.forEach((msg) => {
    newById[msg.id] = msg;

    if (!newOrder.includes(msg.id.toString())) {
      newOrder.push(msg.id.toString());
    }
  });

  newOrder.sort((a, b) => {
    const msgA = newById[a];
    const msgB = newById[b];
    return msgA.timestamp - msgB.timestamp;
  });

  const newHasMore = normalized_msg.length === prev.store.remote.limit; //cuando devuelva menos que limit es que ya no quedan mensajes en la bdd

  const newOffset = newOrder.length;

  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        // active: "private",
        private: {
          ...prev.store.feed.private,
          [userId]: {
            ...existingConversation,
            byId: newById,
            order: newOrder,
            remote: {
              ...existingConversation.remote,
              offset: newOffset,
              hasMore: newHasMore,
            },
          },
        },
      },
    },
    inboxMeta: {
      ...prev.inboxMeta,
      [userId]: {
        ...(prev.inboxMeta[userId] ?? {}),
        lastMessageTimestamp:
          normalized_msg[normalized_msg.length - 1]?.timestamp ?? 0,
      },
    },
  };
};

export const handleUpdatePublicData = (
  normalized_msg: FeedMessage[],
  prev: AppStore,
): AppStore => {
  const newById = { ...prev.store.feed.public.byId };
  const newOrder = [...prev.store.feed.public.order];

  normalized_msg.forEach((msg) => {
    newById[msg.id] = msg;

    if (!newOrder.includes(msg.id.toString())) {
      newOrder.push(msg.id.toString());
    }
  });

  newOrder.sort((a, b) => {
    const msgA = newById[a];
    const msgB = newById[b];
    return msgA.timestamp - msgB.timestamp;
  });

  const newHasMore = normalized_msg.length === prev.store.remote.limit; //cuando devuelva menos que limit es que ya no quedan mensajes en la bdd

  const newOffset = newOrder.length;

  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        // active: "private",
        public: {
          ...prev.store.feed.public,
          byId: newById,
          order: newOrder,
          remote: {
            ...prev.store.feed.public.remote,
            offset: newOffset,
            hasMore: newHasMore,
          },
        },
      },
    },
  };
};
//HANDLE PARA INTEGRAR DENTRO DEL HANDLESEARCHMSG

export const handleUpdateSearchMsgPriv = (
  query: string,
  prev: AppStore,
  normalized_msg: FeedMessage[],
  id: string,
): AppStore => {
  const new_buffer = { ...prev.store.feed.private[id].searchBuffer };
  const new_byId = { ...prev.store.feed.private[id].byId };
  const current_order = [...prev.store.feed.private[id].order];
  const limit = prev.store.local.limit;

  // Llenamos buffer y byId
  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;
    new_byId[msg.id] = msg;
    if (!current_order.includes(msg.id.toString())) {
      current_order.push(msg.id.toString());
    }
  });

  // Offset inicial: mostramos hasta el límite de mensajes del buffer
  const new_offset = Math.min(limit, current_order.length);

  // Matches visibles SOLO dentro de los mensajes que estamos mostrando
  const visible_matches = current_order
    .slice(0, new_offset)
    .map((msgId) => new_buffer[msgId])
    .filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    .map((m) => m.id.toString());

  // Hay más mensajes que mostrar si el buffer tiene más que el offset inicial
  const new_hasMore = new_offset < current_order.length;

  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        mode: "local",
        private: {
          ...prev.store.feed.private,
          [id]: {
            ...prev.store.feed.private[id],
            byId: new_buffer,
            searchBuffer: new_buffer,
            remote: { ...prev.store.feed.private[id].remote },
            order: current_order,
          },
        },
      },
      local: {
        ...prev.store.local,
        matches: visible_matches,
        activeIndex: 0,
        offset: new_offset,
        hasMore: new_hasMore,
        limit, // limit original para el memo
      },
    },
  };
};

//FUNCION PARA ACTUALIZAR EN CADA SCROLL LAS PROPIEDADES DE BUSQUEDA LOCAL O REMOTE
//VERIFICARLA BIEN ESTA A PRUEBA
export const handleUpdateView = (
  prev: AppStore,
  id: string,
  currentActiveIndex: number,
  query: string,
): AppStore => {
  const new_buffer = { ...prev.store.feed.private[id].searchBuffer };
  const current_order = [...prev.store.feed.private[id].order];
  const limit = prev.store.local.limit;

  // Nuevo offset: sumamos el limit al offset actual
  const new_offset = Math.min(
    prev.store.local.offset + limit,
    current_order.length,
  );

  // Matches visibles: recalculamos SOLO dentro de los mensajes que vamos a mostrar
  const visible_matches = current_order
    .slice(0, new_offset) // ahora sí tomamos más mensajes visibles
    .map((msgId) => new_buffer[msgId])
    .filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    .map((m) => m.id.toString());

  const new_hasMore = new_offset < current_order.length;

  return {
    ...prev,
    store: {
      ...prev.store,
      local: {
        ...prev.store.local,
        offset: new_offset, // cuántos mensajes del buffer estamos mostrando
        matches: visible_matches, // recalculamos matches visibles
        hasMore: new_hasMore,
        activeIndex: currentActiveIndex,
        limit, // limit original
      },
    },
  };
};

export const handleUpdateViewPublic = (
  prev: AppStore,
  currentActiveIndex: number,
  query: string,
): AppStore => {
  const new_buffer = { ...prev.store.feed.public.searchBuffer };
  const current_order = [...prev.store.feed.public.order];
  const limit = prev.store.local.limit;

  // Nuevo offset: sumamos el limit al offset actual
  const new_offset = Math.min(
    prev.store.local.offset + limit,
    current_order.length,
  );

  // Matches visibles: recalculamos SOLO dentro de los mensajes que vamos a mostrar
  const visible_matches = current_order
    .slice(0, new_offset) // ahora sí tomamos más mensajes visibles
    .map((msgId) => new_buffer[msgId])
    .filter((m) => m.text.toLowerCase().includes(query.toLowerCase()))
    .map((m) => m.id.toString());

  const new_hasMore = new_offset < current_order.length;

  return {
    ...prev,
    store: {
      ...prev.store,
      local: {
        ...prev.store.local,
        offset: new_offset, // cuántos mensajes del buffer estamos mostrando
        matches: visible_matches, // recalculamos matches visibles
        hasMore: new_hasMore,
        activeIndex: currentActiveIndex,
        limit, // limit original
      },
    },
  };
};

export const handleUpdateSearchMsgPublic = (
  query: string,
  prev: AppStore,
  normalized_msg: FeedMessage[],
): AppStore => {
  const new_buffer = { ...prev.store.feed.public.byId };
  const new_byId = { ...prev.store.feed.public.byId };
  const new_order = [...prev.store.feed.public.order];

  const limit = prev.store.local.limit;

  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;

    new_byId[msg.id] = msg;

    if (!new_order.includes(msg.id.toString())) {
      new_order.push(msg.id.toString());
    }
  });

  const new_offset = Math.min(limit, new_order.length); //calculo el new_offset sumando el offset y el limit
  const new_matches = Object.values(new_order)
    .slice(0, new_offset)
    .map((msgId) => new_buffer[msgId])
    .filter((m) => m.text.toLowerCase().includes(query))
    .map((m) => m.id.toString());

  const new_hasMore = new_matches.length > new_offset; //calculo si la longitud de matches es mayor al new_offset
  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        mode: "local",
        public: {
          ...prev.store.feed.public,
          byId: new_buffer,
          order: new_order,
          searchBuffer: new_buffer,
          remote: {
            ...prev.store.feed.public.remote,
            offset: new_offset,
            hasMore: new_hasMore,
          },
        },
      },
      local: {
        ...prev.store.local,
        matches: new_matches,
        activeIndex: 0,
        limit,
        hasMore: new_hasMore,
        offset: new_offset,
      },
    },
  };
};

//FUNCION PARA RESETEAR PROPIEDADES AL CERRAR BUSQUEDA LOCAL Y CONSOLIDAR NUEVO FEED

export const handleNewFeedPrivate = (prev: AppStore, id: string): AppStore => {
  const order = [...prev.store.feed.private[id].order];

  //aca hay que actualizar el order de la store y ademas el byId
  const consolidateOrder = order.slice(
    0,
    prev.store.feed.private[id].remote.offset,
  );

  //hay que resetear las propiedades de busqueda local
  const currentById = { ...prev.store.feed.private[id].byId };

  const newById: Record<string, FeedMessage> = {};
  consolidateOrder.forEach((id) => {
    newById[id] = currentById[id];
  });
  const new_offset = prev.store.feed.private[id].remote.offset;

  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        mode: "remote",
        active: "private",
        private: {
          ...prev.store.feed.private,
          [id]: {
            byId: newById, //aca agregar el byId consolidado
            order: consolidateOrder,
            searchBuffer: {},
            remote: {
              offset: new_offset,
              hasMore: order.length > new_offset,
              loading: false,
            },
          },
        },
      },
      local: {
        matches: [],
        activeIndex: 0,
        hasMore: false,
        limit: prev.store.remote.limit,
        offset: 0,
        currentMsgId: "0",
      },
    },
  };
};
export const handleNewFeedPublic = (prev: AppStore): AppStore => {
  const order = [...prev.store.feed.public.order];
  //aca hay que actualizar el order de la store y ademas el byId
  const consolidateOrder = order.slice(0, prev.store.feed.public.remote.offset);
  //hay que resetear las propiedades de busqueda local
  const currentById = { ...prev.store.feed.public.byId };
  const newById: Record<string, FeedMessage> = {};
  consolidateOrder.forEach((id) => {
    newById[id] = currentById[id];
  });
  const new_offset = prev.store.feed.public.remote.offset;
  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        mode: "remote",
        public: {
          byId: newById, //aca agregar el byId consolidado
          order: consolidateOrder,
          searchBuffer: {},
          remote: {
            ...prev.store.remote,
            offset: new_offset,
            loading: false,
            hasMore: false,
          },
        },
      },
      local: {
        ...prev.store.local,
        matches: [],
        activeIndex: 0,
      },
    },
  };
};
