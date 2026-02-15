"use server";

import { Value } from "@sinclair/typebox/value";
import type { Env } from "./schema";
import { EnvSchema } from "./schema";

// Get process.env variables (strings or undefined)
const rawEnv = Object.fromEntries(
  Object.keys(EnvSchema.properties).map((key) => [key, process.env[key]]),
);

// Apply schema defaults for missing keys.
const env: Env = Value.Default(EnvSchema, rawEnv) as Env;

// Validation
if (!Value.Check(EnvSchema, env)) {
  const errors = [...Value.Errors(EnvSchema, env)];
  throw new Error(
    `Environment validation failed: ${JSON.stringify(errors, null, 2)}`,
  );
}

export const getEnv = async (): Promise<Env> => env;
