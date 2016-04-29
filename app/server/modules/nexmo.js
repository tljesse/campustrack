var rest = require("./rest.js");

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getNexmoOptions = function()
{
    var options = {
        host: 'https://rest.nexmo.com/sms',
        port: 443,
        path: '',
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        }
    };

    return options;
}

/**
 * Parse Query:  Querys objects of a className.
 * @param className
 * @param onResults: callback function for results
 */
exports.query = function(className, onResults)
{
    console.log("nexmo::query");

    var options = getNexmoOptions();
    options.path = '/1/classes/' + className;

    console.log(options);
    rest.getJSON(options, onResults);
};

