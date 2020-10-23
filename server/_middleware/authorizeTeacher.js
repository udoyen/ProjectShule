const jwt = require('express-jwt');
const { secret } = require('dbConfig.json');
const db = require('_connection/dbConnection');

module.exports = authorize;

function authorize() {
    return[
        //authenticate JWT token and attach decoded token to request as req.user
        jwt({ secret, algorithms: ['HS256'] }),

        //attach full user record to request object
        async (req, res, next) => {
            //get user with id from token 'sub'(subject) property
            const user = await db.teachers.findByPk(req.user.sub);

            //check if user still exist
            if(!user)
                return res.status(401).json({ message: 'Unauthorized user'});
            // authorization successful
            req.user = user.get();
            next();
        }
    ];
}