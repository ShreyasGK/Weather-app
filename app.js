const {query} = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/home.html");
})

app.post("/", function (req, res) {

    const query = req.body.cityName;
    const apiKey = "88b68b185cc83ac523236584af16d956";
    const unit = req.body.units;
    var tempdata = swap(unit);
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        if (response.statusCode === 404) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            response.on("data", function (data) {

                const wdata = JSON.parse(data);
                const temp = wdata.main.temp;
                const wdesc = wdata.weather[0].description;
                const icon = wdata.weather[0].icon;
                const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"


                res.write("<h1><center>The temperature in " + query + " is " + temp + " " + tempdata + "</center></h1>");
                res.write("<center><img src=" + imageURL + "></center>");
                res.send();
            })
        }
        console.log(response);
    })
})

app.listen(6969, function () {
    console.log("Server running on port 6969");
})

function swap(unit) {

    if (unit == "metric") 
        tempdata = "Degree Celcius";
     else if (unit == "standard") 
        tempdata = "Kelvin";
     else 
        tempdata = "Fahrenheit";
    


    return tempdata;
}
