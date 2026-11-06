import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// React Router pilote les builds client/serveur ; Tailwind traite les styles partagés.
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: {
      // Le même alias est déclaré dans jsconfig.json pour les imports compris par l'éditeur.
      "~": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
});
