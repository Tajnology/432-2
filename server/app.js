const path = require("path");
const createError = require("http-errors");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const port = 8080;

var app = express();

// Use helmet
app.use(helmet({
    contentSecurityPolicy: false
}));

// Enable access from all domains
app.use(cors());

// Serve out the static assets correctly
app.use(express.static("../client/build"));

// Import the routers
const analysisRouter = require("./routes/analysis");

app.use("/api/analysis", analysisRouter);

// Forward any routes which don't match the static assets or api to the React
// application. This allows for the use of things such as React Router.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Listen on a given port
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}!`);
});

module.exports = app;
