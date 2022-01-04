const router = require("express").Router();
const User = require("../mongoModels/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// REGISTER
router.post("/register", async (req, res) => {
    // get input from user and hash password
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.CRYPTO_SEC).toString(),
    });
    try {
        // save new user
        const newUserSaved = await newUser.save();
        res.status(201).json(newUserSaved);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
});
// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        // if username does not exist in DB
        !user && res.status(401).json("Wrong email or password.");

        // decrypting the hashed password
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.CRYPTO_SEC);

        const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        // if user input a wrong password
        userPassword !== req.body.password && res.status(401).json("Wrong email or password.");

        const accToken = jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, { expiresIn: "3d" });

        const { password, ...others } = user._doc;// to ommit the password from being shown in the response after login attempt
        // if login was successfull then send response of the found account
        res.status(200).json({ ...others, accToken });

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;