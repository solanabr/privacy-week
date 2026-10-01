"use client";

import { useEffect } from "react";

export function ClearSuccessCookie() {
  useEffect(() => {
    void fetch("/enviar/sucesso/consume", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);
  }, []);

  return null;
}
