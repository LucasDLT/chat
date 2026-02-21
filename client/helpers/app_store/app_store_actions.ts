import {
  AckHandshake,
  AppStore,
  ClientsConected,
  Conversation,
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
        ...prev.inboxMeta[userId],
        lastMessageTimestamp:
          normalized_msg[normalized_msg.length - 1]?.timestamp ?? 0,
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

  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;

    new_byId[msg.id] = msg;

    if (!current_order.includes(msg.id.toString())) {
      current_order.push(msg.id.toString());
    }
  });
  const new_matches = Object.values(new_buffer)
    .filter((m) => m.text.toLowerCase().includes(query))
    .map((m) => m.id.toString());
  console.log(new_matches, "new_matches");

  const new_offset =
    prev.store.feed.private[id].remote.offset + prev.store.remote.limit;
  //calculo el new_offset sumando el offset y el limit

  const new_hasMore = new_matches.length > new_offset; //calculo si la longitud de matches es mayor al new_offset

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
            
            remote: {
              ...prev.store.feed.private[id].remote,

            },
          },
        },
      },
      local: {
        ...prev.store.local,
        matches: new_matches,
        activeIndex: 0,
        offset: new_offset,
        hasMore: new_hasMore,

      },
    },
  };
};//AHORA EL BUFFER TIENE LO MISMO QUE EL ID, TODA LA BUSQUEDA EN LA BDD, PERO TENEMOS QUE LIMITARLA A LOS 100 PRIMEROS. LO QUE SE ME OCURRE PARA NO AGREGAR MAS ESTADOS, ES, USAR EL BYID PARA LOS RENDERS SIEMPRE, Y EL BUFFER QUE TENGA TODO CARGADO, HACER UN FOREACH CON ORDER Y CARGAR EL BY ID CON LOS PRIMEROS 100 DEL BUFFER

export const handleUpdateSearchMsgPublic = (
  query: string,
  prev: AppStore,
  normalized_msg: FeedMessage[],
): AppStore => {
  const new_buffer = { ...prev.store.feed.public.searchBuffer };
  const new_byId = { ...prev.store.feed.public.byId };
  const new_order = [...prev.store.feed.public.order];

  normalized_msg.forEach((msg) => {
    new_buffer[msg.id] = msg;

    new_byId[msg.id] = msg;

    if (!new_order.includes(msg.id.toString())) {
      new_order.push(msg.id.toString());
    }
  });
  const new_matches = Object.values(new_buffer)
    .filter((m) => m.text.toLowerCase().includes(query))
    .map((m) => m.id.toString());

  const new_offset =
    prev.store.feed.public.remote.offset + prev.store.remote.limit; //calculo el new_offset sumando el offset y el limit

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
          byId: new_byId,
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

  //el currentById quedo con el valor anterior y no conoce lo que hicimos en el buffer
  const currentById = { ...prev.store.feed.private[id].byId };
  //creamos uno nuevo en blanco
  const newById: Record<string, FeedMessage> = {};
  //iteramos order que es el array de Ids que tiene hasta que id llegamos buscando en el buffer. Dentro de la iteracion lo que hacemos es igualar usando el id que se itera, por cada id newbyid es igual al mismo id del currentbyid. Asi se recorta el current tiene el mismo valor de entrada que el buffer anterior por eso calculamos desde el order consolidado que el total de mensajes que vamos a dejar en el feed sea el mismo que el usuario ya vio en pantalla.
  consolidateOrder.forEach((id) => {
    newById[id] = currentById[id];
  });
  //offset toma el mismo valor del offset local, con eso deberiamos poder seguir pidiendo a la bdd desde donde nos quedamos en local, eliminando asi errores al traer mensajes duplicados.
  const new_offset = prev.store.local.offset;
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
            ...prev.store.feed.private[id],
            byId: newById, //aca agregar el byId consolidado
            order: consolidateOrder,
            searchBuffer: {},
            remote: {
              ...prev.store.feed.private[id].remote,
              offset: new_offset,
              hasMore: false,
            },
          },
        },
      },
      local: {
        ...prev.store.local,
        matches: [],
        activeIndex: 0,
        hasMore: false,
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

//FUNCION PARA ACTUALIZAR EN CADA SCROLL LAS PROPIEDADES DE BUSQUEDA LOCAL O REMOTE
//VERIFICARLA BIEN ESTA A PRUEBA
export const handleUpdateView = (
  prev: AppStore,
  id: string,
  currentActiveIndex: number,
): AppStore => {
  const new_buffer = { ...prev.store.feed.private[id].searchBuffer };
  const new_matches = 0;
  const new_offset =
    prev.store.feed.public.remote.offset + prev.store.remote.limit;
  return {
    ...prev,
    store: {
      ...prev.store,
      feed: {
        ...prev.store.feed,
        public: {
          ...prev.store.feed.public,
          remote: {
            ...prev.store.feed.public.remote,
            offset: new_offset,
          },
        },
      },
      local: {
        ...prev.store.local,
        // matches:new_matches,
        activeIndex: currentActiveIndex,
      },
    },
  };
};

//PARA ESTE MOMENTO VAMOS A ESTAR RENDERIZANDO LA LISTA DEL BUFFER YA NO MAS LA DEL ID, EL MODO DEBERIA ESTAR EN LOCAL, OFFSET Y HASMORE DEBERIAN ESTAR CALCULADOS PARA LA PRIMER ITERACION, LOS MATCHES DEBEN TENER LOS MATCHES CARGADOS HASTA LOS PRIMEROS 100 MENSAJES DE LIMIT QUE COLOCAMOS, EL TEMA VA A SER PASARLE EL ACTIVEINDEX ACTUAL AL ESTADO, OSEA QUE ESTA FUNCION DEBE RECIBIRLO PARA QUE AL PRESIONAR EL BOTON DE MAS, NO SE RESETEE
