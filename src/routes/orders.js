import { Router } from "express";
import tokenVerification from "../services/jwt.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getTotalSales,
  updateStatus,
} from "../services/orders.js";

const orderRouter = Router();

orderRouter.post("/", tokenVerification, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
    } = req.body;

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
    res
      .status(500)
      .json({ error: "Failed to create order. Please try again later." });
  }
});

orderRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await updateStatus(id, status);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "Failed to create order. Please try again later." });
  }
});

orderRouter.get("/", async (req, res) => {
  try {
    const orders = await getAllOrders();
    // const orderItemsIds = orders.flatMap(order => order.orderItems.map(item => item.id));

    // console.log(orders);
    // console.log("orderItemsIds");
    // console.log(orderItemsIds);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res
      .status(500)
      .json({ error: "Failed to get orders. Please try again later." });
  }
});

orderRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    // const orderItemsIds = orders.flatMap(order => order.orderItems.map(item => item.id));

    // console.log(orders);
    // console.log("orderItemsIds");
    // console.log(orderItemsIds);

    res.status(200).json(order);
  } catch (error) {
    console.error("Error getting orders:", error);
    res
      .status(500)
      .json({ error: "Failed to get orders. Please try again later." });
  }
});

orderRouter.get("/get/totalsales", async (req, res) => {
  try {
    const totalSales = await getTotalSales();
    res.status(200).json(totalSales);
  } catch (error) {
    console.error("Error getting orders:", error);
    res
      .status(500)
      .json({ error: "Failed to get orders. Please try again later." });
  }
});

orderRouter.get("/get/userorders/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await getAllOrders(userid);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res
      .status(500)
      .json({ error: "Failed to get orders. Please try again later." });
  }
});

orderRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await deleteOrder(id);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(500)
      .json({ error: "Failed to delete order. Please try again later." });
  }
});

export default orderRouter;
