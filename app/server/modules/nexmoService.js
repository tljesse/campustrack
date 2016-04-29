var nexmo = require('./nexmo.js');

/**
 * Get a list of all students (no filter)
 *
 * @param   req: the http server request object
 * @param   res: the http server response object
 */
exports.querySms = function(req, res)
{
    console.log('\nstudentsSvc::queryStudents');
    nexmo.query("Student",
        function(statusCode, result)
        {
            // The service will need the full objects for processing in the service
            for (index in result.results)
            {
                var student = result.results[index];
                console.log('student: ' + student.name);
            }

            res.statusCode = statusCode;
            res.send(result);
        });
};