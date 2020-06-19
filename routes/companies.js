//Routes for companies table
const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");
const router = new express.Router();

router.get('', async function (req, res, next) {
    try {
        const result = await db.query(`SELECT code, name FROM companies`);
        return res.json({companies: result.rows});
    } catch (e) {
        return next(e);
    }
});


module.exports = router;