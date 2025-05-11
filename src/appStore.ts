import { create } from "zustand";
import { AppSetting } from "../types";
interface AppState {
  settings: AppSetting[];
  setSettings: (settings: AppSetting[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  settings: [],
  setSettings: (settings) => set({ settings }),
}));

export const useSettingValue = (key: string) => {
  const settings = useAppStore.getState().settings;
  return settings.find((setting) => setting.systemValue === key)?.enabled;
};
