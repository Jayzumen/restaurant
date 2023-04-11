"use client";
import { Cart } from "@/types/db";
import { useRouter } from "next/navigation";
import React from "react";

const CheckOutButton = ({ cartItems }: { cartItems: Cart[] }) => {
  if (cartItems[0].items?.length === 0) return null;

  const router = useRouter();

  async function checkOut() {
    const lineItems = cartItems[0].items?.map((item) => {
      return {
        price: item.id,
        quantity: item.quantity,
      };
    });
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lineItems }),
    });
    const data = await res.json();
    router.push(data.session.url);
  }

  return <button onClick={checkOut}>Check Out</button>;
};

export default CheckOutButton;
