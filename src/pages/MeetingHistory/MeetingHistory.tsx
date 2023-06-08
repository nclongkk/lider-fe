import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Collapse,
  Divider,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { getMeetingHistory } from "../../api/app";
import { formatDateTime, getDurationString } from "../../utils";
import "./MeetingHistory.css";

const limitDefault = 10;
const { Panel } = Collapse;
interface QueriesProps {
  page?: number;
  isActive?: boolean;
  limit?: number;
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

const MeetingHistoryTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: limitDefault, // Number of items per page
    total: 0, // Total number of items
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

  return (
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
      <h2>Meeting History</h2>
      <MeetingHistoryTable />
    </div>
  );
};

export default MeetingHistory;
