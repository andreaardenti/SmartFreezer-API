//MIDDLEWARE UTENTE
var userAuth = function(req, res, next) {
    for(var user of users) {
        if(user.id == req.params.by) {
            next();
        }
    }
    users.push({id: req.params.by, purchases: []})
    next();
}

module.exports = function(req,res,next) {
    if(req.method === 'GET') {
        res.end('GET method not supported');
    } else {
        next();
    }
};