const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
//display static content through the server
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(3000, function(){
    console.log(`Server is running at port 3000.`);
});