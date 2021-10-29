const express = require("express");

const router = express.Router();


router.get("/", (req,res) => {
	res.send("Reddit Route");
});

module.exports = router;
