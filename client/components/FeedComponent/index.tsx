import Image from "next/image";

interface FeedProps {
  activeFeed: boolean;
  privateIdMsg: string | undefined;
  messageFeed: string[];
  messageFeedPriv: string[];
  clientSelected: string | undefined;
}

export const FeedSection: React.FC<FeedProps> = ({
  activeFeed,
  privateIdMsg,
  messageFeed,
  messageFeedPriv,
  clientSelected,
}) => {
  return (
    <section
      className={`${
        activeFeed
          ? "flex yellowBg justify-center items-center h-100vh "
          : "hidden"
      }`}
    >
      {privateIdMsg ? (
        <section
          className={`h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-bl-xs rounded-br-xs 
          `}
        >
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider  xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            {clientSelected}
          </h3>
          <div
            className={` flex flex-col items-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
          >
            {messageFeedPriv.map((msg, index) => {
              return (
                <p key={index} className="">
                  {msg}
                </p>
              );
            })}
          </div>
        </section>
      ) : (
        //section para el feed de mensajes publicos
        <section className=" h-[65vh] w-95 top-46 xl:h-[90vh] xl:w-[80vw]  absolute xl:top-1 xl:right-16.5 rounded-sm">
          <Image
            src={"/background-directorio.jpg"}
            width={3000}
            height={1000}
            alt="background feed chat"
            className={`w-full h-full object-cover z-0 rounded-xs`}
          ></Image>
          <h3 className="absolute top-5 left-25 xl:top-0 rounded-b-sm bg-yellow-50/25 tracking-wider xl:left-56 flex justify-center items-center w-60 xl:w-[50vw] h-10 text-2xl mesoninaRegular backdrop-blur-xl z-10">
            mensaje publico
          </h3>
          <div
            className={` flex flex-col items-center overflow-y-auto h-[40vh] xl:h-[84vh] absolute g-2 top-14 xl:top-11  w-94 xl:w-[79vw]`}
          >
            {messageFeed.map((msg, index) => {
              return (
                <p key={index} className="text-center mt-2 xl:mt-2 ">
                  {msg}
                </p>
              );
            })}
          </div>
        </section>
      )}
    </section>
  );
};
