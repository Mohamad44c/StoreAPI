const router = require("express").Router();


router.post("/payment", (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeError, stripeResponse) => {
        if (stripeError) {
            res.status(500).json(stripeError);
        } else {
            res.status(200).json(stripeResponse);
        }
    });
});

module.exports = router;