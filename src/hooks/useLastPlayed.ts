import { create } from "zustand";
import type { Track } from "../types/track";
import { persist } from "zustand/middleware";

type LastPlayedStore = {
    lastPlayed:Track | null;
    setLastPlayed:(track:Track) => void
}

export const useLastPlayed = create<LastPlayedStore>()(
    persist(
        (set)=> ({
            lastPlayed:null,
            setLastPlayed:(track)=> set({lastPlayed:track}),
        }),
        {name:'last_played'}
    )
);