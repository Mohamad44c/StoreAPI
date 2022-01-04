const mongoose = require("mongoose");

const BagSchema = new mongoose.Schema(

    {
        userID: { type: String, required: true, unique: true },
        products: [
            {
                productID: { type: String },
                quantity: { type: Number, default: 1 }
            }
        ]

    }, { timestamps: true }
)

module.exports = mongoose.model("Bag", BagSchema);