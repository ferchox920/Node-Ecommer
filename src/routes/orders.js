import { Router } from "express";
import tokenVerification from "../services/jwt.js";
import { createOrder } from "../services/orders.js";

const orderRouter = Router();

orderRouter.get("/", async (req, res) => {
  try {
    
    res.status(200).json("orders");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

orderRouter.post("/", tokenVerification, async (req, res) => {
    try {
      const userId = req.user.id;
      const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone } = req.body;
  
      const orderData = {
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
      };
  
      const createdOrder = await createOrder(orderItems, orderData, userId);
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order. Please try again later." });
    }
  });
  

export default orderRouter;
