import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import { getAmountInAmountOut } from "../../../api/payment";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const StatisticPaymentColumn: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([
    "",
    "",
  ]);

  const { data: statisticPayment, isLoading: statisticPaymentLoading } =
    useQuery({
      queryKey: ["statisticPayment", selectedDateRange],
      queryFn: () =>
        getAmountInAmountOut({
          from: selectedDateRange[0],
          to: selectedDateRange[1],
        }),
      select: ({ data }) => data?.result,
    });

  useEffect(() => {
    if (statisticPayment && !statisticPaymentLoading) {
      const config: any = {
        data: statisticPayment,
        isGroup: true,
        xField: "date",
        yField: "amount",
        seriesField: "type",
        label: {
          position: "middle",
          layout: [
            { type: "interval-adjust-position" },
            { type: "interval-hide-overlap" },
            { type: "adjust-color" },
          ],
        },
      };
      setConfig(config);
    }
  }, [statisticPayment, statisticPaymentLoading]);

  const [config, setConfig] = useState<any>(null);

  const handleDateChange = (dates: any, dateStrings: string[]) => {
    setSelectedDateRange(dateStrings);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Payment Histories</h2>
        <RangePicker onChange={handleDateChange} />
      </div>
      <div style={{ height: "400px", marginTop: "20px" }}>
        {config ? <Column {...config} /> : <div>Loading...</div>}
      </div>
    </div>
  );
};

export default StatisticPaymentColumn;
