import React from "react";
import { getTimeFrequency, statisticMeeting } from "../../../api/app";
import { useQuery } from "@tanstack/react-query";
import { Line } from "@ant-design/plots";

const MeetingFrequency: React.FC = () => {
  const currentDate: string = new Date().toISOString().split("T")[0];
  const fromDateString: string = new Date(
    new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  const fromDate: string = fromDateString.slice(0, 10);
  const toDate: string = currentDate.slice(0, 10);

  const { data, isLoading: statisticMeetingLoading } = useQuery({
    queryKey: ["statisticMeeting"],
    queryFn: () => statisticMeeting({ from: fromDate, to: toDate }),
    select: ({ data }) => data?.result,
  });

  if (statisticMeetingLoading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the data
  }

  const config = {
    data,
    xField: "date",
    yField: "value",
    seriesField: "type",
    point: {
      size: 5,
      shape: "diamond",
    },
  };

  return (
    <div>
      <h2>Meetings</h2>
      <div
        style={{
          height: "400px",
          marginTop: "20px",
        }}
      >
        <Line {...config} />
      </div>
    </div>
  );
};

export default MeetingFrequency;
