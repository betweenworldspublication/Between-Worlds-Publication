import { createClient } from "@sanity/client";

export const sanityWriteClient = createClient({
    projectId: "ftoag85l",
    dataset: "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});