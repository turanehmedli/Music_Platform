export type AudiusUser = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  follower_count: number;
  followee_count: number;
  track_count: number;
  is_verified: boolean;
  profile_picture: {
    "150x150": string;
    "480x480": string;
    "1000x1000": string;
  };
  cover_photo?: {
    "640x"?: string;
    "2000x"?: string;
  };
};