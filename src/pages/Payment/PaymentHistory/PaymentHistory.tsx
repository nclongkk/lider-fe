import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import moment from "moment";
import "./PaymentHistory.css";
import { useState } from "react";
import { fetchTransactions } from "../../../api/payment";

const columns = [
  {
    title: "Transaction ID",
    dataIndex: "transactionId",
    key: "transactionId",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (text) => {
      const typeArr = text.split("_");
      const formattedType = typeArr
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return formattedType.replace("-", " ");
    },
  },
  {
    title: "Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (text, record) => {
      const greenStyle = {
        color: "#52c41a",
        fontWeight: "bold",
      };
      const redStyle = {
        color: "#f5222d",
        fontWeight: "bold",
      };
      console.log(record.operator);
      let totalAmount = record.amount;
      if (record.operator === "+") {
        totalAmount =
          record.amount +
          record.amount * record.metadata.service +
          record.amount * record.metadata.taxCharge;
      }
      if (record.operator === "+") {
        return <span style={greenStyle}>{totalAmount.toFixed(2)}</span>;
      }
      return <span style={redStyle}>{totalAmount.toFixed(2)}</span>;
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => {
      const className = text === "done" ? "status-done" : "status-pending";
      return (
        <div className={className}>
          <span className={`${className}-span`}>{text}</span>
        </div>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
  },
];
const TransactionsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, data, error } = useQuery(
    ["transactions", currentPage],
    () => fetchTransactions({ page: currentPage, limit: 10 })
  );
  //casting data to any[] because the data is not typed

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Can not fetch Payment history</div>;
  }

  return (
    <Table
      dataSource={data?.data?.result?.content}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10, current: currentPage }}
      onChange={handleTableChange}
    />
  );
};
export const PaymentHistory: React.FC = () => <TransactionsTable />;
