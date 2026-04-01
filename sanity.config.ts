import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import article from "./sanity/article";

export default defineConfig({
  name: "default",
  title: "Between Worlds",
  projectId: "ftoag85l",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: [article],
  },
});