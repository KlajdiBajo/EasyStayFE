import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "/auth/refresh",
      { refreshToken: auth?.refreshToken },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newAccessToken = response.data.accessToken;

    setAuth((prev) => ({
      ...prev,
      accessToken: newAccessToken,
    }));

    return newAccessToken;
  };

  return refresh;
};

export default useRefreshToken;
