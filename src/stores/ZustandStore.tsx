import { create } from "zustand";

interface RodrigoState {
    isRenderApiAvailable: boolean,
    setIsRenderApiAvailable: (renderApi: boolean) => void
}

export const useApplicationState = create<RodrigoState>((set, get) => ({
    isRenderApiAvailable: false,
    setIsRenderApiAvailable: (isRenderApiAvailable: boolean) => set({ isRenderApiAvailable })
}));