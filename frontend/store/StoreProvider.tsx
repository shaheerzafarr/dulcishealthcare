"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "./index";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Store is created once and reused to avoid re-creation on hot reloads
  return <Provider store={store}>{children}</Provider>;
}
