const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv"); // Add this line

// Load environment variables from .env file
dotenv.config(); // Add this line

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  const jsondata = JSON.stringify(data);
  const url = `https://us21.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`; // Use process.env to access environment variables
  const options = {
    method: "POST",
    auth: `uchith:${process.env.MAILCHIMP_API_KEY}`, // Use process.env
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      // console.log(JSON.parse(data))
    });
  });
  request.write(jsondata);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.post("/success", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});

// 74bf4f5484

