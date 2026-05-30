import { create } from "zustand";
import { persist } from "zustand/middleware";

type Artist = {
    id:string;
    name:string;
    profile_picture?:{
        '150x150':string;
        '480x480':string;
    }
    follower_count?:number
};

type FollowingStore = {
    following: Artist[];
    follow:(artist:Artist)=> void;
    unfollow:(id:string)=>void;
    isFollowing:(id:string)=> boolean
}

export const useFollowing = create<FollowingStore>()(
    persist(
        (set, get)=>({
            following:[],
            follow:(artist)=>{
                if(get().isFollowing(artist.id)) return;
                set({following:[...get().following, artist]})
            },
            unfollow:(id)=>{
                set({following:get().following.filter((a)=>a.id !== id)})
            },
            isFollowing:(id)=> get().following.some((a)=> a.id === id)
        }),
        {name:'following'}
    )
)