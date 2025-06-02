const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { isLoggedIn } = require('../middleware/authmiddleware');

// Create customer (accepts both phone and mobile, stores both for compatibility)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      mobile,
      totalSpend,
      visitCount,
      lastPurchase,
      segmentTags,
    } = req.body;

    const customer = new Customer({
      name,
      email,
      phone: phone || mobile || "",
      mobile: mobile || phone || "",
      totalSpend,
      visitCount,
      lastPurchase,
      segmentTags,
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});
// Get customer count
router.get("/count", async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Failed to get customer count:", err);
    res.status(500).json({ error: "Failed to get customer count" });
  }
});

// ✅ GET all customers (protected)
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new customer (protected)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT (update) customer (protected)
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE customer (protected)
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
