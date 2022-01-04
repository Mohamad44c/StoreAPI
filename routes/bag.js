const router = require("express").Router();
const CryptoJs = require("crypto-js");
const Bag = require("../mongoModels/Bag");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyTok");

// CREATE BAG 
router.post("/", verifyToken, async (req, res) => {
    const newBag = new Bag(req.body);
    try {
        const savedBag = await newBag.save();
        res.status(200).json(savedBag);
    } catch (error) {
        res.status(500).json(error);
    }
});


// UPDATE BAG
router.put("/:id", verifyTokenAndAuth, async (req, res) => {

    try {
        const updatedBag = await Bag.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedBag);
    } catch (error) {
        res.status(500).json(error);
    }
});


// DELETE BAG
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Bag.findByIdAndDelete(req.params.id);
        res.status(200).json("Bag Deleted Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET CUSTOMER BAG
router.get("/find/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const bag = await Bag.findOne({ userId: req.params.userId });
        res.status(200).json(bag);
    } catch (error) {
        res.status(500).json(error);
    }
});


// GET ALL BAGS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const allBags = await Bag.find();
        res.status(200).json(allBags);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;