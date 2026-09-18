import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "de.healthangels.levelup",
  appName: "LevelUp",
  webDir: "dist",
  ios: {
    contentInset: "automatic",
    backgroundColor: "#FAF9F6",
  },
};

export default config;
