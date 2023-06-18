import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Collapse,
  Divider,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Input,
  DatePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { getMeetingHistory } from "../../api/app";
import { formatDateTime, getDurationString } from "../../utils";
import "./MeetingHistory.css";
import React from "react";
import { rechargeMeetingFee } from "../../api/app";

const { RangePicker } = DatePicker;

const { Search } = Input;

const limitDefault = 10;
const { Panel } = Collapse;
interface QueriesProps {
  page?: number;
  from?: string;
  to?: string;
  paid?: boolean;
  unpaid?: boolean;
  isActive?: boolean;
  isEnded?: boolean;
  roomId?: string;
}

const columns = [
  {
    title: "Custom Room ID",
    dataIndex: "customRoomId",
    key: "customRoomId",
  },
  {
    title: "Access Type",
    dataIndex: "accessType",
    key: "accessType",
    render: (accessType) => (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tag>{accessType}</Tag>
      </div>
    ),
  },
  {
    title: "Status",
    dataIndex: "endedAt",
    key: "status",
    render: (endedAt) => {
      return endedAt ? (
        <Tag color="geekblue">Ended</Tag>
      ) : (
        <Tag color="green">In meeting</Tag>
      );
    },
  },
  {
    title: "Payment Status",
    dataIndex: "status",
    key: "paymentStatus",
    render: (status) => {
      return status === "paid" ? (
        <Tag color="green">Paid</Tag>
      ) : (
        <Tag color="red">Unpaid</Tag>
      );
    },
  },
  {
    title: "Total Members",
    dataIndex: "members",
    key: "totalMembers",
    render: (members) => members.length,
  },
  {
    title: "Started At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => formatDateTime(new Date(createdAt)),
  },
  {
    title: "Duration",
    dataIndex: "endedAt",
    key: "duration",
    render: (endedAt, record) => {
      return getDurationString(new Date(endedAt), new Date(record.createdAt));
    },
  },
];

interface ITabChoose {
  ended: boolean;
  inMeeting: boolean;
  paid: boolean;
  unpaid: boolean;
}

const MeetingHistoryTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [queries, setQueries] = useState<QueriesProps>({} as QueriesProps);
  const [tabChoose, setTabChoose] = useState<ITabChoose>({
    ended: false,
    inMeeting: false,
    paid: false,
    unpaid: false,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: limitDefault, // Number of items per page
    total: 0, // Total number of items
  });

  const rechargeMeet = useMutation({
    mutationKey: ["rechargeMeetingFee"],
    mutationFn: rechargeMeetingFee,
    onSuccess: ({ data: newData }) => {
      message.success("Recharge meeting fee successfully");
      //update this row
      // refresh data
      const newDataList = data.map((item) => {
        if (item["_id"] === newData._id) {
          return newData;
        }
        return item;
      });
      setData(newDataList as never[]);
    },
    onError: (error: any) => {
      console.log(error);
      message.error(error.response.data.message);
    },
  });

  const { data: meetingHistories, isLoading } = useQuery({
    queryKey: ["meetingHistory", page],
    queryFn: () =>
      getMeetingHistory({
        page: pagination.current,
        limit: pagination.pageSize,
      }),
    onSuccess: (data) => {
      setPagination({
        current: data?.data?.result?.paging?.page,
        total: data?.data?.result?.paging?.total,
        pageSize: limitDefault,
      });
      const content = data?.data?.result.content;
      content && content.map((item) => (item.key = item._id));
      setData(data?.data?.result?.content);
    },
  });

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPagination(pagination);
  };

  const renderMemberTimeline = (member) => (
    // <ul className="member-timeline">
    //   <li>
    //     <Space>
    //       <Tag color="green">Connected</Tag>
    //       <span>{member.connectedAt}</span>
    //     </Space>
    //   </li>
    //   <li>
    //     <Space>
    //       <Tag color="red">Disconnected</Tag>
    //       <span>{member.disconnectedAt}</span>
    //     </Space>
    //   </li>
    // </ul>
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        padding: "10px",
        marginTop: "10px",
        boxShadow: "1px 10px 10px 0px rgba(0,0,0,0.1)",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Collapse style={{ width: "100%" }} bordered={false}>
        <Collapse.Panel
          key="1"
          header={
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                <Avatar
                  src={member.avatar}
                  alt={member.username}
                  style={{ width: "32px", height: "32px", marginRight: "10px" }}
                />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                  {member.username}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                  }}
                >
                  Connected At: {formatDateTime(member.connectedAt)}
                </span>
                {!!member.disconnectedAt && (
                  <span>
                    Disconnected At: {formatDateTime(member.disconnectedAt)}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {!!member.disconnectedAt ? (
                  <Tag color="red" style={{ marginLeft: "10px" }}>
                    Leaved
                  </Tag>
                ) : (
                  <Tag color="green" style={{ marginLeft: "10px" }}>
                    Live
                  </Tag>
                )}
              </div>
            </div>
          }
        >
          <div>
            <p>Metadata</p>
            {member.metadata &&
              Object.keys(member.metadata).map((key) => (
                <div key={key}>
                  <span style={{ fontWeight: "bold" }}>{key}:</span>
                  <span style={{ marginLeft: "10px" }}>
                    {member.metadata[key]}
                  </span>
                </div>
              ))}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );

  const renderMember = (member) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar src={member.avatar} alt={member.username} />
        <span
          style={{
            marginLeft: "6px",
            fontWeight: "bold",
          }}
        >
          {member.username}
        </span>
      </div>
    );
  };

  const renderPanelContent = (meeting) => (
    <div
      className="panel-content"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "20px",
          marginRight: "20px",
          borderRadius: "10px",
          boxShadow: "1px 10px 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            ID:{" "}
            <Typography.Text
              copyable
              style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {meeting.customRoomId}
            </Typography.Text>
          </span>
          {meeting.endedAt && <Tag color="geekblue">Ended</Tag>}
          {!meeting.endedAt && <Tag color="green">In meeting</Tag>}
        </div>
        <Divider />
        <div className="flex w-full">
          <div className="flex flex-col p-2 w-1/2">
            <div style={{ fontWeight: 400 }}>
              <span style={{ marginRight: "20px" }}>
                Started at: <span>{formatDateTime(meeting.createdAt)}</span>
              </span>
              {meeting.endedAt && (
                <span>
                  Ended at: <span>{formatDateTime(meeting.endedAt)}</span>
                </span>
              )}
            </div>
            <div>
              {meeting.endedAt && (
                <span>
                  Duration:{" "}
                  <span>
                    {getDurationString(
                      new Date(meeting.endedAt),
                      new Date(meeting.createdAt)
                    )}
                  </span>
                </span>
              )}
            </div>
            <div>
              <span>
                Access Type:{" "}
                <span
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  {meeting.accessType}
                </span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span style={{ marginRight: "20px" }}>Started by:</span>
              {renderMember(meeting.createdBy)}
            </div>
          </div>
          <div className="flex flex-col p-2 w-1/2">
            <p>
              Payment Status: {""}
              {meeting.status === "paid" ? (
                <Tag color="green">Paid</Tag>
              ) : (
                <Tag color="red">Unpaid</Tag>
              )}
              {meeting.status === "unpaid" && (
                //retry payment button
                <button
                  className="btn btn-primary"
                  style={{
                    marginLeft: "20px",
                    outline: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    backgroundColor: "#010085",
                    color: "#ffffff",
                  }}
                  onClick={() => {
                    rechargeMeet.mutate({ meetingId: meeting._id });
                  }}
                >
                  <ReloadOutlined />
                  {""} Retry
                </button>
              )}
            </p>
            {meeting.paymentId && (
              <p>
                Payment ID:{" "}
                <Typography.Text
                  copyable
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {meeting.paymentId}
                </Typography.Text>
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {meeting.members.map((member) => {
          return renderMemberTimeline(member);
        })}
      </div>
    </div>
  );

  useEffect(() => {
    console.log(tabChoose);
    const { ended, inMeeting, paid, unpaid } = tabChoose;

    if (ended) {
      document.getElementById("tab-ended")?.classList.add("tab-clicked");
    } else {
      document.getElementById("tab-ended")?.classList.remove("tab-clicked");
    }

    if (inMeeting) {
      document.getElementById("tab-in-meeting")?.classList.add("tab-clicked");
    } else {
      document
        .getElementById("tab-in-meeting")
        ?.classList.remove("tab-clicked");
    }
    if (paid) {
      document.getElementById("tab-paid")?.classList.add("tab-clicked");
    } else {
      document.getElementById("tab-paid")?.classList.remove("tab-clicked");
    }
    if (unpaid) {
      document.getElementById("tab-unpaid")?.classList.add("tab-clicked");
    } else {
      document.getElementById("tab-unpaid")?.classList.remove("tab-clicked");
    }
  }, [tabChoose]);

  return (
    <>
      <div className="top-actions">
        <div className="tab-list flex">
          <button
            id="tab-ended"
            className="tab tab-clicked"
            onClick={() =>
              setTabChoose({ ...tabChoose, ended: !tabChoose.ended })
            }
          >
            <span className="tab-title">Ended</span>
          </button>
          <button
            id="tab-in-meeting"
            className="tab"
            onClick={() =>
              setTabChoose({ ...tabChoose, inMeeting: !tabChoose.inMeeting })
            }
          >
            <span className="tab-title">In meeting</span>
          </button>
          <button
            id="tab-paid"
            className="tab"
            onClick={() =>
              setTabChoose({ ...tabChoose, paid: !tabChoose.paid })
            }
          >
            <span className="tab-title">Paid</span>
          </button>
          <button
            id="tab-unpaid"
            className="tab"
            onClick={() =>
              setTabChoose({ ...tabChoose, unpaid: !tabChoose.unpaid })
            }
          >
            <span className="tab-title">Unpaid</span>
          </button>
        </div>
        <button
          className="tab"
          style={{ outline: "none" }}
          onClick={() => {
            document.getElementById("filter")?.classList.toggle("hidden");
          }}
        >
          <SearchOutlined />
        </button>
      </div>
      <div className="filter hidden" id="filter">
        <Search
          placeholder="Input your room Id"
          allowClear
          enterButton="Search"
          style={{ width: 800 }}
        />
        <RangePicker />
      </div>
      <Spin spinning={isLoading}>
        <Table
          className="meeting-history-table"
          dataSource={data}
          key="_id"
          columns={columns}
          expandable={{
            expandedRowRender: (record) => renderPanelContent(record),
            rowExpandable: () => true,
          }}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Spin>
    </>
  );
};

const MeetingHistory: React.FC = () => {
  return (
    <div
      style={{
        width: "80%",
        marginTop: "40px ",
        margin: "20px auto",
        // marginLeft: "40px",
        marginLeft: "auto",
      }}
    >
      <h2 className="my-10">Meeting History</h2>
      <MeetingHistoryTable />
    </div>
  );
};

export default MeetingHistory;
