import { axiosClient } from "./axios";


export const setupIntentStripe = () => axiosClient.post("/payments/stripe/setup-intent");

export const attachPaymentMethod = (body: { paymentMethodId: string }) => axiosClient.post("/payments/stripe/attach-payment-method", body);

export const getPaymentMethods = () => axiosClient.get("/payments/stripe");

export const updateDefaultPaymentMethodFn = ({paymentMethodId}) => axiosClient.patch(`/payments/stripe/default-card/${paymentMethodId}`);

export const detachPaymentMethodFn = ({paymentMethodId}) => axiosClient.delete(`/payments/stripe/${paymentMethodId}`);

export const requetsPaymentIntentFn = ({amount}) => axiosClient.post(`/payments/stripe/payment-intent`, {amount});

export const getUserPaymentDetail = () => axiosClient.get("/payments/user");

export const requestPayPalPaymentFn = ({amount}) => axiosClient.post(`/payments/paypal/request-payment`, {amount});

export const capturePayPalPaymentFn = ({orderId}) => axiosClient.post(`/payments/paypal/fulfill`, {orderId});

export const fetchTransactions = ({page,limit}:{page: number, limit?: number}) => axiosClient.get(`/payments/history?page=${page}&limit=${limit}`);

export const getTotalAmount = () => axiosClient.get("/payments/statistics/total")

export const getAmountInAmountOut =({from, to}:{from: string, to: string}) => axiosClient.get(`payments/statistics/amount-in-amount-out?from=${from}&to=${to}`)