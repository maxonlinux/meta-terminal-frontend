"use client";

import { createContext, useContext } from "react";
import type { Env } from "./schema";

const EnvContext = createContext<Env | null>(null);

export const EnvProvider = ({
  env,
  children,
}: {
  env: Env;
  children: React.ReactNode;
}) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

export const useEnv = (): Env => {
  const ctx = useContext(EnvContext);
  if (!ctx) throw new Error("useEnv must be used within EnvProvider");
  return ctx;
};
