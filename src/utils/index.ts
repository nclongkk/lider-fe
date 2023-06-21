import mastercard from "../assets/mastercard.png";
import visa from "../assets/visa.png";
import amex from "../assets/amex.png";
import diners from "../assets/diners.png";
import discover from "../assets/discover.png";
import jcb from "../assets/jcb.png";
import unionpay from "../assets/unionpay.png";

export const getStorage = (key: string) => localStorage.getItem(key);

export const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const removeStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const scrollToBottom = () => {
  const objDiv = document.getElementById("endDiv");
  if (objDiv) objDiv.scrollTop = objDiv?.scrollHeight;
};

// export const socket = io(import.meta.env.VITE_API_URL_SOCKET, {
//   auth: {
//     token: getStorage("token"),
//   },
//   transports: ["websocket"],
// });

export const formatTimeSpan = (time: string): string => {
  const now = new Date();
  const date = new Date(time);
  const diff = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diff / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInMinutes < 1) {
    return "Just now";
  }
  if (diffInHours < 1) {
    return `${diffInMinutes}m`;
  }
  if (diffInDays < 1) {
    return `${diffInHours}h`;
  }
  if (diffInWeeks < 1) {
    return `${diffInDays}d`;
  }
  if (diffInMonths < 1) {
    return `${diffInWeeks}w`;
  }
  if (diffInYears < 1) {
    return `${diffInMonths}m`;
  }
  return `${diffInYears}y`;
};

export const download = (link: string) => {
  const element = document.createElement("a");
  element.setAttribute("href", link);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const chooseCard = (card) => {
  switch (card) {
    case "mastercard":
      return mastercard;
    case "visa":
      return visa;
    case "amex":
      return amex;
    case "diners":
      return diners;
    case "discover":
      return discover;
    case "jcb":
      return jcb;
    case "unionpay":
      return unionpay;
    default:
      return mastercard;
  }
}

export const getDurationString = (endedAt: Date, createdAt: Date): string => {
  if (!endedAt || !createdAt) return '';
  const durationInSeconds = Math.abs(endedAt.getTime() - createdAt.getTime()) / 1000;

  if (durationInSeconds < 60) {
    return `${Math.floor(durationInSeconds)} seconds`;
  }
  if (durationInSeconds < 3600) {
    const minutes = Math.floor(durationInSeconds / 60);
    return `${minutes} minutes`;
  } 
  
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export  const formatDateTime = (date) => {
    //format date time to dd/mm/yyyy hh:mm
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    return `${day}/${month}/${year} ${hour}:${minute}`;
  };