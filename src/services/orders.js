import OrderItem from "../models/order-item.js";
import Order from "../models/orders.js";

export async function getAllOrders() {
  try {
    const orders = await Order.find()
      .populate("user")
      .sort({ dateOrdered: -1 })
      .exec();
    return orders;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw new Error("Failed to get orders. Please try again later.");
  }
}

export async function getOrderById(id) {
  try {
    const order = await Order.findById(id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    return order;
  } catch (error) {
    console.error("Error getting order:", error);
    throw new Error("Failed to get order. Please try again later.");
  }
}

export async function getTotalSales() {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales || totalSales.length === 0) {
      throw new Error("The order sales cannot be generated");
    }

    return totalSales[0].totalsales;
  } catch (error) {
    console.error("Error generating total sales:", error);
    throw new Error("Failed to generate total sales. Please try again later.");
  }
}

export async function getoOderCount (){
  try {
    const orderCount = await Order.countDocuments();
    return orderCount;
  } catch (error) {
    console.error("Error getting order count:", error);
    throw new Error("Failed to get order count. Please try again later.");
  }
}

export async function getUserOrder(userid) {
  try {
    const orderList = await Order.find({ user: userid })
      .populate({ 
        path: 'orderItems', 
        populate: {
          path: 'product', 
          populate: 'category'
        } 
      })
      .sort({ 'dateOrdered': -1 });

    return orderList;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw new Error("Failed to get user orders. Please try again later.");
  }
}



export async function updateStatus(id, status) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order. Please try again later.");
  }
}

export async function createOrder(orderItems, orderData, user) {
  let newOrder;
  let savedOrderItems = [];

  try {
    const orderItemsId = await Promise.all(
      orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        const savedOrderItem = await newOrderItem.save();
        savedOrderItems.push(savedOrderItem);
        return savedOrderItem._id;
      })
    );

    const totalPrices = await Promise.all(
      orderItemsId.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((total, price) => total + price, 0);

    newOrder = new Order({
      orderItems: orderItemsId,
      shippingAddress1: orderData.shippingAddress1,
      shippingAddress2: orderData.shippingAddress2,
      city: orderData.city,
      zip: orderData.zip,
      country: orderData.country,
      phone: orderData.phone,
      user: user,
      totalPrice: totalPrice,
    });

    const createdOrder = await newOrder.save();
    return createdOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    // Si se produce un error, eliminamos los OrderItems guardados
    for (const savedOrderItem of savedOrderItems) {
      await OrderItem.findByIdAndDelete(savedOrderItem._id);
    }
    if (newOrder) {
      await newOrder.remove();
    }
    throw new Error("Failed to create order. Please try again later.");
  }
}

export async function deleteOrder(id) {
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      throw new Error("Order not found.");
    }

    // Eliminar los elementos de pedido asociados
    for (const orderItemId of deletedOrder.orderItems) {
      await OrderItem.findByIdAndDelete(orderItemId);
    }

    return deletedOrder;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new Error("Failed to delete order. Please try again later.");
  }
}
