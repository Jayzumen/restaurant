"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return <Toaster position="bottom-center" reverseOrder={false} />;
};

export default ToastProvider;
