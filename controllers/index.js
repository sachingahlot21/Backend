const { Cart } = require('../modals/index')

async function handleCartData(req, res) {
    const body = req.body;
    const { user, items } = req.body;
    if (!body || !body.user || !Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ msg: "All fields are required" });
    }
    for (const item of body.items) {
        if (!item.productid ||
            !item.image ||
            !item.usp ||
            !item.offer ||
            !item.itemName ||
            typeof item.price !== 'number' ||
            typeof item.discount !== 'string' ||
            typeof item.priceBefore !== 'string' ||
            typeof item.rating !== 'string' ||
            typeof item.number !== 'string' ||
            typeof item.count !== 'number'
        ) {
            return res.status(400).json({ msg: "Invalid cart item data" });
        }

    }

    try {
        let cart = await Cart.findOne({ user });
        if (cart) {
            items.forEach((newItem) => {
                const existing = cart.items.find(item => item.productid === newItem.productid);
                if (existing) {
                    existing.count += 1;  
                } else {
                    cart.items.push(newItem);
                }
            });
            await cart.save();
        } else {
            cart = await Cart.create({ user, items });
        }
        res.status(201).json(cart);
    } catch (err) {
        console.error('Error saving cart:', err);
        res.status(500).json({ error: err.message });
    }
}

async function handleGetCartData(req, res) {
    const userId = req.query.user;
    const allCartData = await Cart.findOne({ user: userId })
    return res.json(allCartData)
}

async function handleDeleteCartItem(req, res) {
    const { userId, itemId } = req.params;

    if (!itemId) {
        return res.status(400).json({ msg: "Item ID is required" });
    }
    try {
        const cart = await Cart.findOne({ user: userId });
        cart.items = cart.items.filter(item => item.productid !== itemId);
        await cart.save();
        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }




}
async function handleIncrementCartItem(req, res) {
    const { userId, itemId } = req.params;
    console.log('it', itemId)
    if (!itemId || !userId) {
        return res.status(400).json({ msg: "Item ID or User ID is required" });
    }

    try {
        const cart = await Cart.findOne({ "user": userId });

        if (!cart) {
            return res.status(404).json({ msg: "User not found containing the item" });
        }
        const item = cart.items.find(item => item.productid === itemId);
        if (!item) {
            return res.status(404).json({ msg: "Item not found in cart" });
        }
        item.count++;
        await cart.save();
        return res.json({ msg: "Item count incremented successfully" });
    } catch (error) {
        console.error('Error incrementing item count:', error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}
async function handleDecrementCartItem(req, res) {

    const { userId, itemId } = req.params;

    if (!itemId) {
        return res.status(400).json({ msg: "Item ID is required" });
    }

    try {
        const cart = await Cart.findOne({ user: userId });
        const item = cart.items.find(item => item.productid === itemId);
        if (item.count > 1) item.count--;
        else cart.items = cart.items.filter(i => i.productid !== itemId);
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function handleCartDataBulk(req, res) {
    const { user, items } = req.body;
    try {
        let cart = await Cart.findOne({ user });

        if (!cart) {
            cart = new Cart({ user, items });
        } else {
            // Merge logic
            items.forEach((newItem) => {
                const existingItem = cart.items.find(item => item.productid === newItem.productid);
                if (existingItem) {
                    existingItem.count += newItem.count;
                } else {
                    cart.items.push(newItem);
                }
            });
        }

        await cart.save();
        res.status(200).json({ message: 'Cart synced successfully', cart });
    } catch (err) {
        console.error('Error syncing cart:', err);
        res.status(500).json({ error: 'Failed to sync guest cart' });
    }
}

module.exports = { handleCartData, handleCartDataBulk, handleGetCartData, handleDeleteCartItem, handleIncrementCartItem, handleDecrementCartItem }