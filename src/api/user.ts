import { axiosClient } from "./axios";

export const getUser = () => axiosClient.get("/auth/verify-token");

export const updateUser = (body: {
  name: string;
  avatar: string;
  phone: string;
}) => axiosClient.put("/users", body);

export const getUserByEmail = ({ email }: { email: string }) => {
  return axiosClient.get(`/users/email`, { params: { email } });
};

export const addMemberToGroup = ({
  email,
  groupId,
}: {
  email: string;
  groupId: string;
}) => {
  return axiosClient.post(`/groups/${groupId}/members`, { email });
};

export const inviteMemberToGroup = ({
  email,
  groupId,
}: {
  email: string;
  groupId: string;
}) => {
  return axiosClient.post(`/groups/${groupId}/invite`, { email });
};
