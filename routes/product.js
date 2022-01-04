const router = require("express").Router();
const CryptoJs = require("crypto-js");
const Product = require("../mongoModels/Product");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyTok");

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});


// UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});


// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product Deleted Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET PRODUCTS
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const newQuery = req.query.new; // query by new products
    const categoryQuery = req.query.category; // query by category
    try {
        let products;
        if (newQuery) {
            // get the newest 10 products
            products = await Product.find().sort({ createdAt: -1 }).limit(10);
        } else if (categoryQuery) {
            // get products by category
            products = await Product.find({
                categories: {
                    $in: [categoryQuery],
                },
            });
        } else {
            // get all products
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;