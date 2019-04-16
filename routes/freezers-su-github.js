//FILE VECCHIO DI CARLO

var express = require('express');
var router = express.Router();

var freezers = [{
    id: 1,
    lock: true,
    events: [],
    purchases: []
}, {
    id: 2,
    lock: true,
    events: [],
    purchases: []
}];

var addEvent = function(freezer, req, type) {
    var length = freezer.events.length;
    if (freezer.events.length !=0 && freezer.events[length-1].type == type && freezer.events[length-1].by == req.params.by) {
        freezer.events[length-1].at = new Date();
    } else {
        freezer.events.push({type: type, by: req.params.by, lock: freezer.lock, at: new Date()});
    }
}

router.get('/reset', function(req, res){
    freezers = [{
        id: 1,
        lock: true,
        events: [],
        purchases: []
    }, {
        id: 2,
        lock: true,
        events: [],
        purchases: []
    }];
    res.json();
});

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

router.post('/:id/purchases', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            //freezer.purchases = []; 
            freezer.purchases.push(req.body.purchase);
            return res.json(freezer.purchases);
        }
    }
    res.json({});
});

router.get('/:id/purchases', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            return res.json(freezer);
        }
    }
    res.json();
});

router.get('/:id/:by/unlock', function(req, res){ // questa api la può chiamare solo il client
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            freezer.lock = false;
            addEvent(freezer, req, 'unlock');
            return res.json(freezer);
        }
    }
    res.json();
});

router.get('/:id/:by/lock', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
            freezer.lock = true;
            addEvent(freezer, req, 'lock');
            return res.json(freezer);
        }
    }
    res.json();
});

router.get('/:id/:by/events', function(req, res){
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

router.get('/:id/:by', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
           addEvent(freezer, req, 'read');
           return res.json(freezer);
        }
    }
    res.json();
});

router.get('/:id', function(req, res){
    for(const freezer of freezers) {
        if (freezer.id == req.params.id) {
           return res.json(freezer);
        }
    }
    res.json();
});


router.get('/', function(req, res){
    res.json(freezers);
});



module.exports = router;
