import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, Button, Input, message, Modal, Spin, Typography } from "antd";
import { cancelJoinGroup, getGroups, Group, leaveGroup } from "../api/group";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { joinGroup } from "../api/group";
import useCurrentUser from "../hooks/useCurrentUser";

enum BUTTON_TYPE {
  JOIN_REQUEST = "Join",
  CANCEL = "Cancel",
  LEAVE = "Leave",
  PENDING = "Pending",
}

const buttonType = (item: any, userInfo: any): BUTTON_TYPE => {
  const isGroupMember =
    item.members?.findIndex((member) => member.user === userInfo?._id) !== -1;
  if (isGroupMember) return BUTTON_TYPE.LEAVE;

  if (item?.joinRequests?.findIndex((req) => req.user === userInfo?._id) !== -1)
    return BUTTON_TYPE.PENDING;

  return BUTTON_TYPE.JOIN_REQUEST;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

const LeaveButton = ({ id }: { id: string }) => {
  const { userInfo } = useCurrentUser();
  const [currentState, setCurrentState] = useState(BUTTON_TYPE.LEAVE);
  const leaveGroupMutation = useMutation({
    mutationKey: ["leaveGroup"],
    mutationFn: leaveGroup,
    onSuccess: () => {
      message.success("Group left successfully");
      setCurrentState(BUTTON_TYPE.JOIN_REQUEST);
    },
  });

  const cancelJoinGroupMutation = useMutation({
    mutationKey: ["cancelJoinGroup"],
    mutationFn: cancelJoinGroup,
    onSuccess: () => {
      message.success("Join request cancelled successfully");
      setCurrentState(BUTTON_TYPE.JOIN_REQUEST);
    },
  });

  const joinGroupMutation = useMutation({
    mutationKey: ["joinGroup"],
    mutationFn: joinGroup,
    onSuccess: () => {
      message.success("Sent join request successfully");
      setCurrentState(BUTTON_TYPE.PENDING);
    },
  });

  return (
    <Button
      type="primary"
      danger={currentState === BUTTON_TYPE.LEAVE}
      loading={leaveGroupMutation.isLoading}
      onClick={() => {
        try {
          if (currentState === BUTTON_TYPE.JOIN_REQUEST) {
            return joinGroupMutation.mutate(id);
          }

          if (currentState === BUTTON_TYPE.PENDING) {
            cancelJoinGroupMutation.mutate({
              groupId: id,
              requesterId: userInfo?._id,
            });
            return;
          }
          leaveGroupMutation.mutate(id);
        } catch (e) {
          message.error((e as Error).message);
        }
      }}
    >
      {currentState}
    </Button>
  );
};

const JoinButton = ({ id, isPending }: { id: string; isPending?: boolean }) => {
  const { userInfo } = useCurrentUser();
  const [currentState, setCurrentState] = useState(
    !isPending ? BUTTON_TYPE.JOIN_REQUEST : BUTTON_TYPE.PENDING
  );

  const joinGroupMutation = useMutation({
    mutationKey: ["joinGroup"],
    mutationFn: joinGroup,
    onSuccess: () => {
      message.success("Sent join request successfully");
      setCurrentState(BUTTON_TYPE.PENDING);
    },
  });

  const cancelJoinGroupMutation = useMutation({
    mutationKey: ["cancelJoinGroup"],
    mutationFn: cancelJoinGroup,
    onSuccess: () => {
      message.success("Join request cancelled successfully");
      setCurrentState(BUTTON_TYPE.JOIN_REQUEST);
    },
  });

  return (
    <Button
      type="primary"
      className={
        currentState === BUTTON_TYPE.PENDING ? "bg-green-500" : undefined
      }
      loading={joinGroupMutation.isLoading || cancelJoinGroupMutation.isLoading}
      onClick={() => {
        try {
          if (currentState === BUTTON_TYPE.PENDING) {
            return cancelJoinGroupMutation.mutate({
              groupId: id,
              requesterId: userInfo?._id,
            });
          }
          joinGroupMutation.mutate(id);
        } catch (e) {
          message.error((e as Error).message);
        }
      }}
    >
      {currentState}
    </Button>
  );
};

export const SearchModal = ({ open, onClose }: Props) => {
  const { userInfo } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: ["groupsSearch", search, page],
    queryFn: () => getGroups({ page, limit: 5, keyword: search || undefined }),
    select: ({ data }) => {
      return data?.result;
    },
    onSuccess: ({ data }) => {
      setGroups((prev) => [...prev, ...data]);
    },
    enabled: !!search,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const totalPage = Math.ceil(Number(data?.total || 0) / 5);
  const onSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 500);

  useEffect(() => {
    setGroups([]);
  }, [search]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Button type="default" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="mt-6 text-center">
        <Input placeholder="Search" onChange={onSearch} />
        {groups?.map((group) => {
          return (
            <div
              key={group._id}
              className="flex flex-row justify-between items-center"
            >
              <div className="px-6 rounded-lg flex flex-row items-center">
                <Avatar size={50} className="mr-4" src={group.image} />
                <div className="flex flex-col">
                  <Typography.Text>{group.name}</Typography.Text>
                </div>
              </div>
              {(() => {
                const isAdmin =
                  group.members.length === 1 &&
                  group.members.find((member) => member.user === userInfo?._id);

                if (isAdmin) return null;

                if (buttonType(group, userInfo) === BUTTON_TYPE.LEAVE)
                  return <LeaveButton id={group._id} />;

                if (buttonType(group, userInfo) === BUTTON_TYPE.JOIN_REQUEST)
                  return <JoinButton id={group._id} />;

                if (buttonType(group, userInfo) === BUTTON_TYPE.PENDING)
                  return <JoinButton id={group._id} isPending />;
              })()}
            </div>
          );
        })}
        {page < totalPage && !isFetching && (
          <Button
            type="default"
            onClick={() => {
              setPage((page) => page + 1);
            }}
          >
            Load more
          </Button>
        )}

        {isFetching && (
          <div className="h-full flex justify-center">
            <Spin />
          </div>
        )}
      </div>
    </Modal>
  );
};
