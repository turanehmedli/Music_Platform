import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const refreshToken = async (): Promise<string> => {
  try {
    const {
      refreshToken: storedRefreshToken,
      setAccessToken,
      setRefreshToken,
    } = useAuthStore.getState();

    const res = await axios.post<RefreshResponse>(
      "https://dummyjson.com/auth/refresh",
      {
        refreshToken: storedRefreshToken,
        expiresInMins: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const newAccessToken = res.data.accessToken;
    const newRefreshToken = res.data.refreshToken;

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    return newAccessToken
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    }

    throw error;
  }
};
