import React from "react";
import { Column } from "@ant-design/charts";
import { useQuery } from "@tanstack/react-query";
import { getTimeFrequency } from "../../../api/app";

const MeetingTimeColumn: React.FC = () => {
  const {
    data: statisticTimeFrequenct,
    isLoading: statisticTimeFrequenctLoading,
  } = useQuery({
    queryKey: ["statisticTimeFrequenct"],
    queryFn: () => getTimeFrequency(),
    select: ({ data }) => data?.result,
    onError: (error) => {
      console.log(error);
    },
  });

  if (statisticTimeFrequenctLoading) {
    // Data is still loading, display a loading indicator or message
    return <div>Loading...</div>;
  }

  if (!statisticTimeFrequenct) {
    // Data fetching encountered an error or returned empty, handle the error case
    return <div>Error: Failed to fetch data</div>;
  }

  const config = {
    data: statisticTimeFrequenct,
    xField: "hour",
    yField: "duration",
    label: {
      position: "middle",
      layout: [
        { type: "interval-adjust-position" },
        { type: "interval-hide-overlap" },
        { type: "adjust-color" },
      ],
    },
  };

  return (
    <div style={{ height: "170px" }}>
      <h2>Time Frequenct</h2>
      <Column {...config} />
    </div>
  );
};

export default MeetingTimeColumn;