var Flowlytics = require("flowlytics");

var tokens = {
    "xsrf": 'da5e804a-5c05-4b39-b4b9-25accce3593c',
    "user_agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    "cookie": '_ga=GA1.2.1825814221.1549120328; _gid=GA1.2.1880810616.1549120328; zUserAccessToken=95529c6c-493a-48a3-9844-86b618384359; _gat_gtag_UA_98266305_2=1; _gat_gtag_UA_98266305_8=1',
    "auth": 'Bearer 9922977c-5959-4bdd-ba19-bbcde0f623ab',
};

console.log("Initiating retrieval of bot analytics");
var twirlTimer = (function() {
    var P = ["\\", "|", "/", "-"];
    var x = 0;
    return setInterval(function() {
        process.stdout.write("\r" + P[x++]);
        x &= 3;
    }, 250);
    })();

var interval_in_days = 30;

Flowlytics( tokens, interval_in_days ).then( function( resp ) {
    var messages = resp.messages;
    clearInterval(twirlTimer)
    console.log("");
    console.log("--------------------Message Data--------------------");
    console.log(messages);
    console.log("");
    var analytics = resp.analytics;
    console.log("--------------------Analytics Data--------------------");
    console.log(analytics);
} );