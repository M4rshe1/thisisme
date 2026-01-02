import { createRouteHandler } from "@openpanel/nextjs/server";
export const { POST, GET } = createRouteHandler({
  apiUrl: process.env.NEXT_PUBLIC_OPENPANEL_API_URL as string,
});
