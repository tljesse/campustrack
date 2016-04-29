var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(options, onResult)
{
    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var url_parts = url.parse(request.url,true);

    if (!url_parts.hasOwnProperty('to') || !url_parts.hasOwnProperty('msisdn') || !url_parts.hasOwnProperty('text'))
        console.log('This is not an inbound message');
    else {
        //This is a DLR, check that your message has been delivered correctly
        if (url_parts.hasOwnProperty('concat'))
        {
          console.log("Fail:" +  url_parts.status + ": " + url_parts.err-code  +  ".\n" );
        }
        else {
          console.log("Success");
          /*
           * The following parameters in the delivery receipt should match the ones
           * in your request:
           * Request - from, dlr - to\n
           * Response - message-id, dlr - messageId\n
           * Request - to, Responese - to, dlr - msisdn\n
           * Request - client-ref, dlr - client-ref\n
           */
        }

    }

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};