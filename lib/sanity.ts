import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "ftoag85l",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});