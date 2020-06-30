var fs = require("fs");
var http = require("http");
var https = require("https");
var path = require("path");
var url = require("url");
var events = require("events").EventEmitter;
var util = require("util");

function Scraper(address) {

    events.call(this);
    this.address = address;
}

// Inherit the methods of "events".
util.inherits(Scraper, events);

Scraper.prototype.scrape = function (callback) {

    if (typeof (callback) == "function") {

        this.on("image", callback);
    }

    var parsedUrl = url.parse(this.address);

    // Make a reference to the current instance.
    var ref = this;

    // Support HTTPS.
    var protocol = http;
    if (parsedUrl.protocol == "https:") {
        protocol = https;
    }

    var request = protocol.request(this.address, function (response) {

        if (response.statusCode != 200) {
            console.error("Image scraper(1): web page couldn't be found. (statusCode:" + response.statusCode + ")");
            ref.emit("end");
            request.end();
            return process.exit(1);
        }
        else {

            response.setEncoding("utf8");

            var previous = "";

            response.on("data", function (data) {
                var current = previous + data;

                for (let img of current.matchAll(/<a[^>]*?href="([^<"]*?(?:\.jpg)?)"[^<]*?>/ig)) {
                    let url = img[1];

                    ref.emit("image", url);
                }

                previous = data;
            });

            response.on("end", function () {
                ref.emit("end");
            });
        }
    });
    request.end();

    request.on("error", function (e) {

        console.error("Image scraper(2): error while loading web page: " + e + ".");
    });
};

module.exports = Scraper;