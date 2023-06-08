import { axiosClient } from "./axios";
import { Pagination } from "./message";

interface Sender {
  _id: string;
  avatar: string;
  name: string;
}

interface LastMessage {
  _id: string;
  message: {
    _id: string;
    content: string;
    readBy: string[];
    type: string;
  };
  sentAt: string;
  sender: Sender;
  type: string;
}

interface Member {
  joinedAt: Date;
  nickName: string;
  notify: boolean;
  user: string;
  _id: string;
}

export interface Group {
  _id: string;
  image: string;
  name: string;
  joinRequests: string[];
  lastMessage: LastMessage;
  members: Member[];
}

export const getGroups = (
  pagination: Pagination
): Promise<{
  data: {
    result: {
      currentPage: number;
      data: Group[];
      total: number;
    };
  };
}> => {
  return axiosClient.get("/groups", {
    params: pagination,
  });
};

export const createGroup = (body: { name: string; description: string }) => {
  return axiosClient.post("/groups", body);
};

export const getGroupByID = (id: string) => {
  return axiosClient.get(`/groups/${id}`);
};

export const leaveGroup = (id: string) => {
  return axiosClient.post(`/groups/${id}/leave-group`);
};

export const joinGroup = (id: string) => {
  return axiosClient.post(`/groups/${id}/join-requests`);
};

export const cancelJoinGroup = ({
  groupId,
  requesterId,
}: {
  groupId: string;
  requesterId: string;
}) => {
  return axiosClient.delete(`/groups/${groupId}/join-requests/${requesterId}`);
};

export const approveJoinRequest = ({
  groupId,
  requesterId,
}: {
  groupId: string;
  requesterId: string;
}) => {
  return axiosClient.post(`/groups/${groupId}/join-requests/${requesterId}`);
};
