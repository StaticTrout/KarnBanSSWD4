const Product = require('../models/productModel');

const productController = {
    // Get all products
    getAllProducts: (req, res) => {
        Product.query('SELECT * FROM products WHERE is_deleted = 0', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getProductById: (req, res) => {
        Product.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [req.params.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0] || {});
        });
    },

    searchProducts: (req, res) => {
        const keyword = `%${req.params.keyword}%`;
        Product.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [keyword], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    createProduct: (req, res) => {
        const { name, price, discount, review_count, image_url } = req.body;
        const query = 'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)';
        Product.query(query, [name, price, discount, review_count, image_url], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, message: 'Product created' });
        });
    },

    updateProduct: (req, res) => {
        const { name, price, discount, review_count, image_url } = req.body;
        const query = 'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?';
        Product.query(query, [name, price, discount, review_count, image_url, req.params.id], err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product updated' });
        });
    },

    softDeleteProduct: (req, res) => {
        Product.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [req.params.id], err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product soft-deleted' });
        });
    },

    restoreProduct: (req, res) => {
        Product.query('UPDATE products SET is_deleted = 0 WHERE id = ?', [req.params.id], err => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Product restored' });
        });
    },

    getProductsView: (req, res) => {
    Product.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.render('products', { products: results });
        });
    }
};

module.exports = productController;
