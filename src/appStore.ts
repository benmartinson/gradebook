import { create } from "zustand";
import { AppSetting, Klass } from "../types";
interface AppState {
  settings: AppSetting[];
  setSettings: (settings: AppSetting[]) => void;
  dateOrderAsc: boolean;
  setDateOrderAsc: (dateOrderAsc: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  parentDomain: string;
  setParentDomain: (parentDomain: string) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (isAdminAuthenticated: boolean) => void;
  classes: Klass[];
  setClasses: (classes: Klass[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  parentDomain: "",
  setParentDomain: (parentDomain: string) => set({ parentDomain }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
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
  isAdminAuthenticated: false,
  setIsAdminAuthenticated: (isAdminAuthenticated) =>
    set({ isAdminAuthenticated }),
  classes: [],
  setClasses: (classes) => set({ classes }),
}));

export const useSettingValue = (key: string) => {
  const settings = useAppStore((state) => state.settings);
  return settings.find((setting) => setting.systemValue === key)?.enabled;
};
