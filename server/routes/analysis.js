const express = require("express");
const axios = require("axios")
const sentiment = require("sentiment");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("analysis route!");
});

router.post("/", express.json(), (req, res) => {
//router.post("/:mode", express.text(), (req, res) => {
    // Error if no body was posted
    if (!req.body?.data || !Array.isArray(req.body.data)) {
        res.status(400).json({
            "status": false,
            "msg": "invalid body"
        });
        return;
    }

    // Analyse the sentiment of the text
    //let result = new sentiment().analyze(req.body.data);
    let result = req.body.data.map((post) => {
        let postText = post?.title + post?.content;
        if (typeof postText === "string") {
            return new sentiment().analyze(postText).comparative;
        } else {
            console.error("invalid post encountered")
            return undefined;
        }
    });

    // Check if we need to be inefficient
    if (req.body?.mode == "inefficient") {
        console.log("here")
        let result = true;
        let num = 148306271;
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                result = false;
                break;
            }
        }
        console.log("inefficient route used");
    }

    // Send the result
    // Comparative score = normalised score
    res.json({
        "status": true,
        "data": result
    });
});

module.exports = router;
