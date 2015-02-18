var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');

app.listen(3001);
app.use(bodyParser());
app.use(morgan());

//Routes
var routes = {};
routes.syncs = require('./route/syncs.js');
routes.users = require('./route/users.js');


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


//User login End points
//Register
app.post('/users/register', routes.users.register); 

//Login
app.post('/users/signin', routes.users.signin); 

//Logout
app.get('/users/logout', jwt({secret: secret.secretToken}), routes.users.logout); 


//Change items
//Get all updated items
app.get('/syncs/items', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.listPublished);

//Get all items
app.get('/syncs/items/all', routes.syncs.listAll);

//get a specific item
app.get('/syncs/item/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.read);

//get item by tag
app.get('/syncs/items/tag/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.listByTag);

//publish new items 
app.post('/syncs/items', jwt({secret: secret.secretToken}), tokenManager.verifyToken , routes.syncs.create); 

//publish updated items 
app.put('/syncs/items', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.update); 

//Delete a specific item
app.delete('/syncs/item/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.delete);

//Delete all selected items
app.delete('/syncs/items', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.syncs.delete); 


console.log('Blog API is starting on port 3001');
