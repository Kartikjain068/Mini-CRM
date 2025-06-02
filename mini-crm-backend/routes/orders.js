const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isLoggedIn } = require('../middleware/authmiddleware');

router.post('/', async (req, res) => {
  try {
    const { customerId, orderAmount } = req.body;
    if (!customerId || !orderAmount) {
      return res.status(400).json({ error: 'customerId and orderAmount are required' });
    }

    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
