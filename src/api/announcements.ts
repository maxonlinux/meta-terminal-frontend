import { requestJson } from "@/api/http";

export type Announcement = {
  id: string;
  scope: "USER" | "GLOBAL";
  title: string;
  body: string;
  link?: string;
  priority: number;
  createdAt: number;
};

export async function getUserAnnouncements(): Promise<Announcement[]> {
  const { res, body } = await requestJson<Announcement[]>(
    "/proxy/main/api/v1/user/announcements",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok || !Array.isArray(body)) {
    return [];
  }
  return body;
}
