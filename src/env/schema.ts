import { type Static, Type } from "@sinclair/typebox";

export const EnvSchema = Type.Object({
  SITE_NAME: Type.String({ default: "Terminal" }),
  SUPPORT_LINK: Type.String({ default: "https://t.me/" }),
  RECAPTCHA_KEY: Type.String({ default: "" }),
  YEAR_FOUNDED: Type.RegExp(/^\d{4}$/, { default: "2025" }),
});

export type Env = Static<typeof EnvSchema>;
