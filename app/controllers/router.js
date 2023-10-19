const express = require('express');
const path = require('path');
const productsRouter = require('../routes/products');
const adminProductsRouter = require('../routes/admin_products');
const router = express.Router();

function validateAdmin(req, res, next) {
    const header = req.get("x-auth");
    if (!header || header !== "admin")
        return res.status(403).send("Acceso no autorizado, no cuenta con privilegios de administrador")
    next();
}

router.use('/products', productsRouter);
router.use('/admin/products', validateAdmin, adminProductsRouter);

router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname + "/../views/home.html")));
router.get('/shopping_cart', (req, res) => res.sendFile(path.resolve(__dirname + "/../views/shopping_cart.html")));

module.exports = router;