// Server utils
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();

const port = JSON.parse(fs.readFileSync("./conf/appSettings.json")).port;

app.use("/renderer", express.static(path.join(__dirname, "../../renderer")))

app.listen(port, () => {
    console.log(`Server runs on ${port}`);
    console.log(`Server started!`);
})