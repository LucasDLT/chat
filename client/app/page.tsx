"use client";
import { ChangeNickname, RegisterNickname, SendMessage } from "@/types/types";
import { nanoid } from "nanoid";
import { FormEvent, useEffect, useRef, useState } from "react";
import { RegisterNickSection } from "@/components/RegisterSection";
import { useRouter } from "next/navigation";
import { useAppContextWs } from "@/context/context";

export default function Home() {
  const {
    hasNickname,
    setHasNickname,
    setMessageFeedPriv,
    socketRef,
    setMessageFeed,
    privateIdMsg,
    setPrivateIdMsg,
    setClientSelected,
    handleActiveRegister,
    activeRegister,
    changeRegisterNick,
    inputRegister,
    registerNick,
  } = useAppContextWs();

  return (
    <div className="flex flex-col justify-between items-center yellowBg h-screen">
      <RegisterNickSection
        onClick={handleActiveRegister}
        activeRegister={activeRegister}
        onChange={changeRegisterNick}
        value={inputRegister ? inputRegister : ""}
        onSubmit={registerNick}
        hasNickname={hasNickname}
      />
      {/*formulario para registrar nickname
      <form
        onSubmit={registerNick}
        className="flex flex-col g-1 justify-center items-center"
      >
        <label className="mesoninaRegular">Nick</label>
        <input
          type="text"
          className="border border-amber-100"
          onChange={changeRegisterNick}
          value={inputRegister}
        />
        <button className="border rounded p-1 m-1 ">
          {hasNickname ? "cambiar nick" : "registrar nick"}
        </button>
      </form>*/}

      {/*
      
              //contador de usuarios conectados
        <div className="flex gap-2 p-4 m-1 rounded bg-gray-700">
          <button className="hover:cursor-pointer" onClick={returnToGroup}>
            grupo:
          </button>
          <p>{conectedCount ? conectedCount : "usuarios conectados"}</p>
        </div>






        //section para el feed de mensajes privados
        {privateIdMsg ? (
          <section className="border h-[70vh] w-[50vw]">
            <h3>hablas con {clientSelected}</h3>
            <div className="grid grid-cols-1 gap-2 bg-blue-950">
              {messageFeedPriv.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        ) : (
          //section para el feed de mensajes publicos
          <section className="border h-[70vh] w-[50vw]">
            <div className="grid grid-cols-1 gap-2 bg-blue-950">
              {messageFeed.map((msg, index) => {
                return (
                  <p key={index} className="border bg-gray-800">
                    {msg}
                  </p>
                );
              })}
            </div>
          </section>
        )}
      */}

      {/*formulario para envio de mensajes*/}
      {/* 
      <form
        onSubmit={privateIdMsg ? sendMessagePrivate : sendMessage}
        className="flex items-center bg-amber-50 rounded mt-1"
      >
        <input
          onChange={changeInputMessage}
          value={inputMsg}
          type="text"
          className="border m-1 rounded bg-neutral-800 text-white p-1"
        />
        <button className="border m-1 rounded bg-neutral-800 text-white text-sm p-1.5 hover:cursor-pointer">
          enviar
        </button>
      </form>
      */}
      <section className="bg-black flex justify-center items-center h-[40vh] w-full xl:h-[40vh] xl:w-full ">
        <h1 className="animalHunter titleColor font-bold tracking-wider text-7xl xl:text-7xl">
          LIVE CHAT
        </h1>
      </section>
    </div>
  );
}
