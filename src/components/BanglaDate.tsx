
"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function getSnapshot() {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());
}

function getServerSnapshot() {
  return "আজকের বাজারদর";
}

export default function BanglaDate() {
  const date = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return <>{date}</>;
}
