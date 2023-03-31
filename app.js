const express = require("express");
//const axios = require("axios");
const bodyParser = require("body-parser");
const https = require("https");

require("dotenv").config(
    {
        path:__dirname + '/.env'
    }
);

const PORT = process.env.port || process.env.DEV_PORT;
const app = express();

//allows us to send our data over to our servers
app.use(bodyParser.urlencoded(
    { extended: true }
));
// inside public we have all static files (imgs, .css etc.)
app.use(express.static("public"));


//setting up our requests and responses to the GET request on "/" route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//setting up our requests and responses to the POST request on "/" route
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //crete our data we want to POST as a JSON
    var data = {
        //we have only one object on our array because we want to ubscribe one person at a time
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    //turn the above JS object (data) into a flat string JSON (this is what we are going to send to mailchimp)
    var jsonData = JSON.stringify(data);

    const user = "us21";
    const listID = "ad0c891c0d";
    const url = `https://${user}.api.mailchimp.com/3.0/lists/${listID}`;
    const apiKey = process.env.API_KEY;
    const options = {
        method: "POST",
        auth: `Sourdough:${process.env.API_KEY}`
    }
    console.log("Api key = " + JSON.stringify(apiKey));

    //we are calling https.request() method to POST our data and see the response from mailchimp server
    const request = https.request(url, options, function (response) {
        console.log("Status Code : " + response.statusCode);
        console.log("options : " + JSON.stringify(options.auth));
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        console.log("[Into https.request] -> response.statusCode : " + response.statusCode);
        response.on("data", function (data) {
        // console.log("JSON.parse(data) = " + JSON.parse(data));
        })
    });

    //we are sending our data to the mailchimp server
    request.write(jsonData);
    request.end();
});

//setting up our response to the POST request on "/failure" route - eg. after pressing btn 'Try again!'
app.post("/failure", function (req, res) {
    res.redirect("/");
});
// setting up our response to the POST request on "/success" route - eg. after pressing btn 'Done!'
app.post("/success", function (req, res) {
    res.redirect("/");
});

app.listen(PORT, function () {
    console.log(`Server is running at port ${PORT}.`);
});