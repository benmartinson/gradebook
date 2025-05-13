import { create } from "zustand";
import { AppSetting } from "../types";
interface AppState {
  settings: AppSetting[];
  setSettings: (settings: AppSetting[]) => void;
  dateOrderAsc: boolean;
  setDateOrderAsc: (dateOrderAsc: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  settings: [],
  setSettings: (settings) =>
    set({
      settings,
      dateOrderAsc: settings.find(
        (setting) => setting.systemValue === "default_date_order_to_ascending"
      )?.enabled,
    }),
  dateOrderAsc: true,
  setDateOrderAsc: (dateOrderAsc) => set({ dateOrderAsc }),
}));

export const useSettingValue = (key: string) => {
  const settings = useAppStore((state) => state.settings);
  return settings.find((setting) => setting.systemValue === key)?.enabled;
};
