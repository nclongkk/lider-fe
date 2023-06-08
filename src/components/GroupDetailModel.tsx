import {
  CheckOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Modal, Avatar, Typography, Button, message } from "antd";
import { useState } from "react";
import { approveJoinRequest, getGroupByID } from "../api/group";
import {
  addMemberToGroup,
  getUserByEmail,
  inviteMemberToGroup,
} from "../api/user";

interface Props {
  groupId: string;
  onClose: () => void;
  open: boolean;
}
export default function GroupModal({ groupId, onClose, open }: Props) {
  const [visibleMembersGroup, setVisibleMembersGroup] = useState(false);
  const [visibleJoinRequest, setVisibleJoinRequest] = useState(false);
  const [visibleAddNewSpace, setVisibleAddNewSpace] = useState(false);
  const [inviteUserInput, setInviteUserInput] = useState("");

  const { data: groupInfo, refetch } = useQuery({
    queryKey: ["groupDetail", groupId],
    queryFn: () => getGroupByID(groupId || ""),
    enabled: !!groupId,
    select: ({ data }) => data?.result,
  });

  const { data: userInfoByEmail } = useQuery({
    queryKey: ["userInfoByEmail", inviteUserInput],
    queryFn: () => getUserByEmail({ email: inviteUserInput }),
    enabled: !!inviteUserInput,
    select: ({ data }) => data?.result,
  });

  const addMemberToGroupMutation = useMutation({
    mutationKey: ["addMember"],
    mutationFn: addMemberToGroup,
    onSuccess: () => {
      message.success("Add member successfully");
      refetch();
    },
  });

  const inviteMemberToGroupMutation = useMutation({
    mutationKey: ["addMember"],
    mutationFn: inviteMemberToGroup,
    onSuccess: () => {
      message.success("Invite member successfully");
      refetch();
    },
  });

  const approveJoinRequestGroup = useMutation({
    mutationKey: ["approveJoinRequest"],
    mutationFn: approveJoinRequest,
    onSuccess: ({ data }) => {
      refetch();
      setVisibleMembersGroup(true);
    },
  });

  return (
    <Modal title="Group Info" open={open} onCancel={onClose} footer={null}>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={
              groupInfo
                ? groupInfo.image
                : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            }
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderColor: "#3E4042",
              borderWidth: 3,
              borderStyle: "solid",
            }}
            alt=""
          />
          <h1>{groupInfo ? groupInfo.name : "Group Name"}</h1>
        </div>
        <div>
          <h2
            style={{
              backgroundColor: "white",
              color: "#3E4042",
              padding: 10,
              borderRadius: 10,
              // border: "1px solid #3E4042",
              boxShadow: "1px 2px 9px #3E4042",
              marginBottom: 20,
            }}
            onClick={() => setVisibleMembersGroup(!visibleMembersGroup)}
          >
            Members
          </h2>

          {visibleMembersGroup && (
            <div>
              {groupInfo.members.map((member, index) => {
                console.log(groupInfo);
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        src={
                          member.user?.avatar
                            ? member.user.avatar
                            : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        }
                      />
                      <h3 style={{ marginLeft: 20 }}>{member.user.name}</h3>
                    </div>
                    {groupInfo.creator === member.user._id && <h4>Author</h4>}
                  </div>
                );
              })}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: 10,
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "#3E4042",
                      borderRadius: 100,
                      border: "1px solid #3E4042",
                      borderStyle: "dashed",
                      margin: 10,
                    }}
                    onClick={() => setVisibleAddNewSpace(!visibleAddNewSpace)}
                  >
                    <PlusOutlined />
                  </button>
                  <h3>Add new</h3>
                </div>
                {visibleAddNewSpace && (
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "#3E4042",
                    }}
                    onClick={() => setVisibleAddNewSpace(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {visibleAddNewSpace && (
                <div
                  style={{
                    marginLeft: 25,
                    marginTop: 5,
                    margin: 10,
                  }}
                >
                  <input
                    style={{
                      backgroundColor: "white",
                      color: "#3E4042",
                      borderRadius: 20,
                      borderColor: "#717478",
                      width: 200,
                    }}
                    onChange={(e) => setInviteUserInput(e.target.value)}
                    type="text"
                  />
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "#3E4042",
                      borderRadius: 20,
                    }}
                    onClick={() => {
                      if (userInfoByEmail) {
                        // inviteUserToGroup({
                        //   groupID: groupInfo._id,
                        //   userID: userInfoByEmail._id,
                        // });
                        setInviteUserInput("");
                      }
                    }}
                  >
                    <PlusCircleOutlined />
                  </button>
                  {userInfoByEmail?._id ? (
                    <div>
                      <Avatar src={userInfoByEmail.avatar} />
                      <Typography.Text>{userInfoByEmail.name}</Typography.Text>
                      <Button
                        onClick={() =>
                          addMemberToGroupMutation.mutate({
                            groupId,
                            email: inviteUserInput,
                          })
                        }
                        icon={<PlusOutlined />}
                      ></Button>
                    </div>
                  ) : (
                    <div>
                      <Typography.Text className="mr-2">
                        User not found
                      </Typography.Text>
                      <Button
                        onClick={() =>
                          inviteMemberToGroupMutation.mutate({
                            groupId,
                            email: inviteUserInput,
                          })
                        }
                      >
                        Add this email
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <h2
            style={{
              backgroundColor: "white",
              color: "#3E4042",
              padding: 10,
              borderRadius: 10,
              boxShadow: "1px 2px 9px #3E4042",
              marginBottom: 20,
            }}
            onClick={() => setVisibleJoinRequest(!visibleJoinRequest)}
          >
            Join request
          </h2>
          {visibleJoinRequest &&
            groupInfo.joinRequests.length > 0 &&
            groupInfo.joinRequests.map((request, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      src={
                        request.user?.avatar
                          ? request.user.avatar
                          : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      }
                    />
                    <h3 style={{ marginLeft: 20 }}>{request.user.name}</h3>
                  </div>
                  <div>
                    <button
                      id="approve"
                      style={{
                        backgroundColor: "green",
                        color: "white",
                      }}
                      onClick={() => {
                        approveJoinRequestGroup.mutate({
                          groupId: groupInfo._id,
                          requesterId: request.user._id,
                        });
                      }}
                    >
                      <CheckOutlined />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
