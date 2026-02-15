import localFont from "next/font/local";

export const gilroy = localFont({
  src: [
    {
      path: "./Gilroy-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Gilroy-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Gilroy-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Gilroy-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
  ],
});
