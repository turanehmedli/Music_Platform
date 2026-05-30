import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState{
    isDarkModeOn:boolean;
    toggleDarkMode:()=> void;
}

export const useTheme = create<ThemeState>()(
    persist((set)=>({
        isDarkModeOn:false,
        toggleDarkMode:()=>
            set((state)=>({isDarkModeOn:!state.isDarkModeOn}))
    }),{name:'theme'})
)