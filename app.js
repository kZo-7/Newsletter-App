const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT || process.env.DEV_PORT;

//in order for our server to serve up static files we need to use the below function
//"express.static()" where we define our public folder
app.use(express.static("public"));

//allows us to send our data over to our servers
app.use(bodyParser.urlencoded(
    { extended: true }
));

//we have to hide API keys to a hidden file to be safe
require("dotenv").config(
    {
        path:__dirname + '/.env'
    }
);

//setting up our requests and responses to the GET request on "/" route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//setting up our requests and responses to the POST request on "/" route
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //create our data we want to POST as a JSON
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
        auth: `Sourdough:${apiKey}`
    }

    //we are calling https.request() method to POST our data and see the response from mailchimp server
    const request = https.request(url, options, function (response) {
        console.log("Status Code : " + response.statusCode);
        //console.log("options : " + JSON.stringify(options.auth));
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

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

app.listen(port, function () {
    console.log(`Server is running at port ${port}.`);
});