export interface Track {
    id:string;
    title:string;
    duration?:string;
    user?:{
        name:string;
    };
    artwork?:{
        '150x150'?:string;
        '480x480'?:string;
        '1000x1000'?:string;

    };
}

export interface TrendingResponse  {
  data: Track[]
}