import OrderItem from "../models/order-item.js";
import Order from "../models/orders.js";




export async function createOrder(orderItems, orderData, user) {
  try {
    const orderItemsId = await Promise.all(
      orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id;
      })
    );

    const totalPrice = orderItems.reduce((total, orderItem) => {
      return total + orderItem.quantity * orderItem.product.price;
    }, 0);

    const newOrder = new Order({
      orderItems: orderItemsId,
      shippingAddress1: orderData.shippingAddress1,
      shippingAddress2: orderData.shippingAddress2,
      city: orderData.city,
      zip: orderData.zip,
      country: orderData.country,
      phone: orderData.phone,
    });

    const createdOrder = await newOrder.save();
    return createdOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order. Please try again later.");
  }
}

