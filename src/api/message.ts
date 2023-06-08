import { axiosClient } from "./axios";
import { APIResponsePaging } from "../types";
import { Pagination } from "antd";

export interface Pagination {
  limit: number;
  page: number;
  keyword?: string;
}

export interface GroupMessage {
  _id: string;
  content: string;
  createdAt: string;
  group: string;
  readBy: string[];
  sender: {
    avatar: string;
    name: string;
    _id: string;
  };
}

type GroupMessageResponse = APIResponsePaging<GroupMessage>;

export const getGroupMessage = ({
  groupId,
  pagination,
}: {
  groupId: string;
  pagination: Pagination;
}): Promise<GroupMessageResponse> => {
  return axiosClient.get(`/groups/${groupId}/messages`, { params: pagination });
};

export const sendGroupMessage = ({
  groupId,
  content,
  type = "text",
  fileName,
}: {
  groupId: string;
  content: string;
  type: string;
  fileName?: string;
}) => {
  return axiosClient.post(`/groups/${groupId}/messages`, {
    content,
    type,
    fileName,
  });
};
