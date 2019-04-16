var express = require('express');
var router = express.Router();

var key1 = "4AQDUA+mO9o=";
var key2 = "4AQDUA+mOXk=";
var key3 = "4AQDUA+k9o8=";

var rfID = {
    key1: "Cavo HDMI", 
    key2: "Playstation game", 
    key3: "Mouse"
};

var freezers = [{
    id: 1,
    lock: true,
    events: [],
    products: []
}, 
{
    id: 2,
    lock: true,
    events: [],
    products: []
}];

var users = [{
    id: "mario",
    purchases: []
}]

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

//AGGIUNGI UTENTE
router.post('/adduser', function(req, res){
    for(var user of users) {
        if(req.body.id != user.id) {
            users.push({id: req.body.id, purchases: []})
        }
    }
    res.json(users)
})


//AGGIUNGI EVENTO
var addEvent = function(freezer, req, type) {
    var length = freezer.events.length;
    if (freezer.events.length !=0 && 
        freezer.events[length-1].type == type &&
        freezer.events[length-1].by == req.params.by) {
        freezer.events[length-1].at = new Date();
    } else {
        freezer.events.push({type: type, by: req.params.by, lock: freezer.lock, at: new Date()});
    }
}

//RESET DEI FREEZERS
router.get('/reset', function(req, res){
    freezers = [{
        id: 1,
        lock: true,
        events: [],
        products: []
    }, {
        id: 2,
        lock: true,
        events: [],
        products: []
    }];
    res.json();
});

//CAMBIAMENTO DI STATO
router.get('/:id/change', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            var events = [];
            for (var event of freezer.events) {
                if (event.type === 'lock' || event.type === 'unlock'){
                    events.push(event);
                }
            }
            return res.json(events);
        }
    }
    res.json();
});



router.post('/:id/products', function(req, res, next) {
    var array = [];
    for (var j=0; j<req.body.purchase.length; j++) {
        if(key1 == req.body.purchase[j]) {
            array.push(rfID.key1)
        }
        else {
            if(key2 == req.body.purchase[j]) {
                array.push(rfID.key2)
            }
            else {
                if(key3 == req.body.purchase[j]) {
                    array.push(rfID.key3)
                }  
            }
        }
       
    }
    var arrayIniziale;
    var diff = [];
    for (const freezer of freezers) {
        if (freezer.id == parseInt(req.params.id)) {
            arrayIniziale = freezer.products
            freezer.products = []
            for (var i=0; i<req.body.purchase.length; i++) {
                freezer.products.push(array[i])
            }
            console.log(typeof freezer.products, "freezer.products dopo push: ", freezer.products)
            diff = symmetricDifference(arrayIniziale, freezer.products)
        }
    }
    console.log(diff);
    res.json(diff);
})

function symmetricDifference(a1, a2) {
    var result = [];
    for (i = 0; i < a2.length; i++) {
        if (a1.indexOf(a2[i]) === -1) {
            result.push(a2[i]);
        }
    }
    for (var i = 0; i < a1.length; i++) {
        if (a2.indexOf(a1[i]) === -1) {
            result.push(a1[i]);
        }
    }
    return result;
}



//INSERIMENTO DI UN ELEMENTO ACQUISTATO
router.post('/:id/purchases/:by', function(req, res, next){
    var i = 0;
    var item1;
    for(const freezer of freezers) {
        if (freezer.id == parseInt(req.params.id)) {
            //OPERAZIONE A - B
            for (var product of freezer.products) {
                if (product == req.body.purchase) {
                    item1 = freezer.products.splice(i, 1);
                }
                i++;
            }
            for (const user of users) {
                if (user.id == req.params.by) {
                    user.purchases.push(item1);
                    return res.json(user.purchases);
                }
            }
        }
    }
    res.json();
});

//API CHE RITORNA TUTTI GLI ELEMENTI DI UN FRIGO
router.get('/:id/products/', function(req, res, next){
    for(const user of users) {
        if (user.id == req.params.by) {
            return res.json(user.purchases);
        }
    }
    res.json();
});

//APERTURA DEL FRIGO
// questa api la può chiamare solo il client
router.get('/:id/:by/unlock', function(req, res, next) { 
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            freezer.lock = false;
            addEvent(freezer, req, 'unlock');
            return res.json(freezer);
        }
    }
    res.json();
});

//CHIUSURA DEL FRIGO, AL MOMENTO INUTILE
router.get('/:id/:by/lock', function(req, res, next){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            freezer.lock = true;
            addEvent(freezer, req, 'lock');
            return res.json(freezer);
        }
    }
    res.json();
});

//EVENTI IN BASE AL FRIGO
router.get('/:id/events', function(req, res, next){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            const result = []
            for(const event of freezer.events) {
                if (event.by === req.params.by) {
                    result.push(event);
                }
            }
           return res.json(result);
        }
    }
    res.json();
});

//EVENTI IN BASE ALL' UTENTE, DA SISTEMARE
router.get('/:id/', function(req, res, next){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            addEvent(freezer, req, 'read');
            return res.json(freezer);
        }
    }
    res.json();
});

//RITORNA TUTTO IL FREEZER
router.get('/:id', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
           return res.json(freezer);
        }
    }
    res.json();
});

//RITORNA TUTTO
router.get('/', function(req, res){
    res.json(freezers);
});

//PRODOTTI PRESENTI NEL FREEZER, INUTILIZZATA
router.get('/:id/products', function(req,  res){
    for (const freezer of freezers) {
        if (freezer.id == req.params.id) {
            return res.json(freezer.products);
        }
    }
    res.json();
})


module.exports = router;