var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */

router.get('/userlist', function (req, res) {           // URI path that leads to this action
    var collection = req.db.get('ContactList');         // Name of the collection in the database
    collection.find({}, {}, function(e, docs){
        res.json(docs);
    });
});

router.post('/adduser', function(req, res) {            // URI path that leads to this action
    var collection = req.db.get('ContactList');         // Name of the collection in the database
    collection.insert(req.body, function(err, result) {
        res.send(
            (err === null) ? { msg : ''} : {msg : err}
        );
    });
});

router.delete('/deleteuser/:id', function(req,res) {    // URI path that leads to this action
    var collection = req.db.get('ContactList');         // Name of the collection in the database
    var userToDelete = req.params.id;
    collection.remove({"_id" : userToDelete }, function(err) {
        res.send(
            (err === null) ? { msg : ''} : {msg : err}
        );
    });
});

module.exports = router;
