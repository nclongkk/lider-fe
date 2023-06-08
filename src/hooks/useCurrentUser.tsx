import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/user";
import { User } from "../interfaces/User";
import { removeStorage } from "../utils";
import { useRouter } from "./useRouter";

export default function useCurrentUser(): {
  userInfo: User;
  refetchUser: () => void;
  logout: () => void;
} {
  const { navigate } = useRouter();
  const { refetch, data } = useQuery(["user"], getUser, {
    cacheTime: Infinity,
    refetchOnWindowFocus: true,
  });

  const logout = () => {
    removeStorage("token");
    navigate("/login");
  };

  return { userInfo: data?.data?.result, refetchUser: refetch, logout };
}
