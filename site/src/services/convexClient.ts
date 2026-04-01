import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

if (!convexUrl) {
  throw new Error(
    "VITE_CONVEX_URL is not set. Add it to .env: VITE_CONVEX_URL=https://third-lark-419.convex.cloud"
  );
}

if (!convexUrl.includes("third-lark-419")) {
  throw new Error(
    `VITE_CONVEX_URL points to '${convexUrl}' which is not the expected deployment. ` +
    "Expected: https://third-lark-419.convex.cloud"
  );
}

export const convex = new ConvexReactClient(convexUrl);
