const express = require("express")
const Cart = require("../models/Carts")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()


router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body
        let cart = await Cart.findOne({ userId: req.user.id })
        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                item: [{ productId, quantity:1}]
            })
        }
        else {
            const itemIndex = cart.item.findIndex(item => item.productId.toString() === productId)
            if (itemIndex > -1) {
                cart.item[itemIndex].quantity += quantity
            } else {
                cart.item.push({ productId, quantity:1 })
            }
            await cart.save()}
        return res.status(201).json({ message: "Product added to cart successfully" })
    } catch (err) {
        
        return res.status(500).json({ message: `error from cart ${err}` })
    }
})

router.get("/", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("item.productId")
        console.log(cart)
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(500).json({ message: `error from cart ${err}` })
    }
})

module.exports = router