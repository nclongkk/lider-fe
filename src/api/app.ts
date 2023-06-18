import { axiosClient } from './axios';

export const getAppDetail = () => axiosClient.get("/app/users");
export const generateToken = () => axiosClient.post("/app/users/token");
export const updateAppUrl = (body: {webUrl: string}) => axiosClient.put("/app/users/web-url", body);

export const getMeetingHistory = (query) => axiosClient.get("/app/meeting",
  {
    params: query
  }
);

export const getTimeFrequency = () => axiosClient.get('/app/statistics/time-frequency')
export const statisticMeeting = ({from, to}: {from: string, to: string}) => axiosClient.get(`/app/statistics/meetings?from=${from}&to=${to}`)

export const getTotalMeeting = () => axiosClient.get('/app/statistics/total')

export const rechargeMeetingFee = ({meetingId}:{meetingId: string}) => axiosClient.post(`/app/users/recharge-meeting-fee` , {id: meetingId})
