//Routes for invoices table
const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");
const router = new express.Router();

router.get('', async function (req, res, next) {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({invoices: result.rows});
    } catch (e) {
        return next(e);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        const result = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, comp_code
            FROM invoices 
            WHERE id = $1`, 
            [id]
        );
        const company = await db.query(
            `SELECT code, name, description 
            FROM companies 
            WHERE code = $1`, 
            [result.rows[0].comp_code]
        );
        if (result.rows.length === 0){
            throw new ExpressError("No invoice found with that id", 404);
        }
        const r = result.rows[0];
        const invoice = {
            id: r.id,
            amt: r.amt,
            paid: r.paid,
            add_date: r.add_date,
            paid_date: r.paid_date,
            company: company.rows[0]
        };
        return res.json({invoice});
    } catch (e) {
        return next(e);
    }
});

router.post('', async function (req, res, next) {
    try {
        const { comp_code, amt } = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2) 
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
            [comp_code, amt]
        );
        return res.status(201).json({invoice: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        const { amt } = req.body;
        const result = await db.query(
            `UPDATE invoices 
            SET amt=$1 
            WHERE id = $2 
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
            [amt, id]
        );
        if (result.rows.length === 0){
            throw new ExpressError("No company found with that code", 404);
        }
        return res.json({invoice: result.rows[0]});
    } catch (e) {
        return next(e);
    }
});


module.exports = router;