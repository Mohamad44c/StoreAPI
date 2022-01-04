const router = require("express").Router();
const CryptoJs = require("crypto-js");
const Order = require("../mongoModels/order");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyTok");

// CREATE ORDER 
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});


// UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});


// DELETE ORDER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order Deleted Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET ORDER
// One customer may have many orders
router.get("/find/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const allOrders = await Order.find({ userId: req.params.userId });
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL ORDERS
// Get all orders from all customers
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const allCustomerOrders = await Order.find();
        res.status(200).json(allCustomerOrders);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    // aggregate: group, operate, analyze data from multiple documents
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project:
                {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group:
                {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;