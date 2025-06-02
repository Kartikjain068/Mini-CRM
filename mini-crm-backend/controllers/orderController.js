const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.createOrder = async (req, res) => {
  try {
    const { customerId, orderAmount, items } = req.body;

    // Save order
    const order = new Order({
      customer: customerId,
      orderAmount,
      items
    });
    await order.save();

    // Update customer metrics
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    customer.totalSpend += orderAmount;
    customer.visitCount += 1;
    customer.lastPurchase = new Date();
    await customer.save();

    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
