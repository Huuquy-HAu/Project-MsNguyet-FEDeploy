import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { postAPI } from "../../../config/api";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

function PayPalPayment() {
  const nav = useNavigate();
  const initialOptions = {
    clientId:
      "AfYToC6DHtj7SjTIw9U53WnUB8-ndpxX7LZJKYWl4LfVxyY1T3W0Ud0uMcAYB6zbY0peaduRZPtjb9so",
    currency: "USD",
    intent: "capture",
  };
  async function createOrderCart(paymentType) {
    const local = localStorage.getItem("address");
    const parserr = JSON.parse(local);
    const phoneNumber = parserr.phone;
    const addRess = parserr.address;
    const dataSource = JSON.parse(localStorage.getItem("dataSource"));

    const obj = {
      data: dataSource,
      phone: phoneNumber,
      address: addRess,
      paymentType: paymentType,
    };
    try {
      if (!obj.data.length) {
        message.error("Vui lòng chọn mua sản phẩm để tạo đơn hàng!");
      } else if (!obj.phone || !obj.address) {
        message.error("Vui lòng điền thông tin, địa chỉ để tạo đơn hàng!");
      } else {
        const dataOder = await postAPI("/order/create-order", obj);
        // console.log(dataOder, 152);
        message.loading({
          content: "Loading...",
        });
        setTimeout(() => {
          message.success({
            content: "Thanh toán thành công bởi PayPal",
            duration: 2,
          });
        }, 1000);
        setTimeout(() => {
          nav("/user/order");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  }

  const createOrder = async () => {
    try {
      const response = await axios.post(
        "https://project-msnguyet-api.onrender.com/api/paypal/my-server/create-paypal-order",
        {
          product: {
            description: "Thanh toán qua PayPal",
            price: (localStorage.getItem("newTotal") || 25000) / 25000,
          },
        }
      );

      const orderData = response.data;
      console.log(69,orderData)

      if (!orderData.id) {
        throw new Error("Unexpected error occurred, please try again.");
      }

      return orderData.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    // Capture the funds from the transaction.
    const response = await fetch(
      "https://project-msnguyet-api.onrender.com/api/paypal/my-server/capture-paypal-order",
      {
        method: "POST",
        body: JSON.stringify({
          orderID: data.id,
        }),
      }
    );

    const details = response;
    console.log( 94,details)
    // Show success message to buyer
    createOrderCart("PAYPAL");
  };

  return (
    <div style={{ width: "100%", marginTop: "20px" , display: "flex", justifyContent: "end" , padding: "30px" }}>
      <div style={{width: "300px"}}>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}

export default PayPalPayment;
