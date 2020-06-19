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

router.get('/:code', async function (req, res, next) {
    try {
        let code = req.params.code;
        const result = await db.query(
            `SELECT code, name, description 
            FROM companies 
            WHERE code = $1`, 
            [code]
        );
        if (result.rows.length === 0){
            throw new ExpressError("No company found with that code", 404);
        }
        return res.json({company: result.rows});
    } catch (e) {
        return next(e);
    }
});

router.post('', async function (req, res, next) {
    try {
        const { code, name, description } = req.body;
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING code, name, description`, 
            [code, name, description]
        );
        return res.status(201).json({company: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});

router.put('/:code', async function (req, res, next) {
    try {
        let code = req.params.code;
        const result = await db.query(
            `SELECT code, name, description 
            FROM companies 
            WHERE code = $1`, 
            [code]
        );
        if (result.rows.length === 0){
            throw new ExpressError("No company found with that code", 404);
        }
        return res.json({company: result.rows});
    } catch (e) {
        return next(e);
    }
});


module.exports = router;