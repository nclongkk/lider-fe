import {
  FundViewOutlined,
  LoadingOutlined,
  VideoCameraOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getTotalMeeting } from "../../api/app";
import { getTotalAmount } from "../../api/payment";
import MeetingFrequency from "./MeetingFrequency/MeetingFrequency";
import MeetingTimeColumn from "./StatisticMeetingTime/MeetingTime";
import StatisticPaymentColumn from "./StatisticPayment/StatisticPayment";

const Overview: React.FC = () => {
  const { data: totalAmount, isLoading: totalAmountLoading } = useQuery({
    queryKey: ["totalAmount"],
    queryFn: getTotalAmount,
    select: ({ data }) => data?.result[0],
  });
  const { data: totalMeeting, isLoading: totalMeetingLoading } = useQuery({
    queryKey: ["totalMeeting"],
    queryFn: getTotalMeeting,
    select: ({ data }) => data?.result,
  });

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "60%",
            marginRight: "20px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "16px",
            height: "250px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: "23%",
              height: "100%",
              backgroundColor: "#ddfde7",
              borderRadius: "16px",
              padding: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#3dd954",
                width: "50px",
                height: "50px",

                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoCameraOutlined
                style={{
                  fontSize: "30px",
                  color: "white",
                }}
              />
            </div>
            <p
              style={{
                color: "black",
                fontSize: "35px",
                fontWeight: 800,
                marginTop: "20px",
              }}
            >
              {totalMeetingLoading && <LoadingOutlined />}
              {totalMeeting && totalMeeting["totalActiveMeeting"]}
            </p>
            <p
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              Active Meetings
            </p>
          </div>
          <div
            style={{
              width: "23%",
              height: "100%",
              backgroundColor: "#fff4de",
              borderRadius: "16px",
              padding: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fe957a",
                width: "50px",
                height: "50px",

                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FundViewOutlined
                style={{
                  fontSize: "30px",
                  color: "white",
                }}
              />
            </div>
            <p
              style={{
                color: "black",
                fontSize: "35px",
                fontWeight: 800,
                marginTop: "20px",
              }}
            >
              {totalMeetingLoading && <LoadingOutlined />}
              {totalMeeting && totalMeeting["totalMeeting"]}
            </p>
            <p
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              Total Meetings
            </p>
          </div>
          <div
            style={{
              width: "23%",
              height: "100%",
              backgroundColor: "#fee2e7",
              borderRadius: "16px",
              padding: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#fb5a7f",
                width: "50px",
                height: "50px",

                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WalletOutlined
                style={{
                  fontSize: "30px",
                  color: "white",
                }}
              />
            </div>
            <p
              style={{
                color: "black",
                fontSize: "35px",
                fontWeight: 800,
                marginTop: "20px",
              }}
            >
              {totalAmountLoading && <LoadingOutlined />}
              {totalAmount && (totalAmount["Amount Out"].toFixed(1) || 0)}
            </p>
            <p
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              Total Spent
            </p>
          </div>
          <div
            style={{
              width: "23%",
              height: "100%",
              backgroundColor: "#f4e8ff",
              borderRadius: "16px",
              padding: "20px",
              marginRight: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#bf85ff",
                width: "50px",
                height: "50px",

                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoCameraOutlined
                style={{
                  fontSize: "30px",
                  color: "white",
                }}
              />
            </div>
            <p
              style={{
                color: "black",
                fontSize: "35px",
                fontWeight: 800,
                marginTop: "20px",
              }}
            >
              {totalAmountLoading && <LoadingOutlined />}
              {totalAmount && totalAmount["Amount In"].toFixed(1)}
            </p>
            <p
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: 500,
              }}
            >
              Total Deposit
            </p>
          </div>
        </div>
        <div
          style={{
            width: "40%",
            backgroundColor: "white",
            padding: "20px",
            paddingBottom: "20px",
            borderRadius: "16px",
            height: "250px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          <MeetingTimeColumn />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "48%",
            marginRight: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
              height: "500px",
              width: "100%",
            }}
          >
            <StatisticPaymentColumn />
          </div>
        </div>
        <div style={{ width: "48%" }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
              height: "500px",
              width: "100%",
            }}
          >
            <MeetingFrequency />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
