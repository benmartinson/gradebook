import { ConvexReactClient, ConvexProvider, useQuery } from "convex/react";
import { useEffect } from "react";
import { useAppStore } from "./appStore";

const otherAppUrl = "https://festive-grouse-756.convex.cloud";

const convexOtherApp = new ConvexReactClient(otherAppUrl);

function FetchAndSetSettings() {
  const setSettings = useAppStore((state) => state.setSettings);
  const appSettingsFromOtherApp = useQuery(
    "appSetting:getAppSettingsByAppConfigId" as any,
    { appConfigId: "kd7d796ngp0zgax7c82qtq4fvd7fnxyr" }
  );

  useEffect(() => {
    if (appSettingsFromOtherApp !== undefined) {
      console.log(
        "Fetched settings from other app (real-time):",
        appSettingsFromOtherApp
      );
      setSettings(appSettingsFromOtherApp);
    }
  }, [appSettingsFromOtherApp, setSettings]);

  return null;
}

function AdminDataFetcher() {
  return (
    <ConvexProvider client={convexOtherApp}>
      <FetchAndSetSettings />
    </ConvexProvider>
  );
}

export default AdminDataFetcher;
