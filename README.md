# FullStack App Playground

If you want to develop a simple TO-DO application with MEAN (MongoDB, Express, Angular, Node.js), just follow this step by step and review the source code. This tutorial is based on the [scotch.io](https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular) tutorial.  

### Getting Started

Currently you can download from this repo a Working app for a basic TO-DO list. This will demonstrate how easily you can create apps with MEAN and do your own testing and improvements. The repo has the last working version and differs from the basic tutorial below. All the code is commented so you can guide yourself in the entire process by just reading the files.

### TODO
- Change the TO-DO list application to a simple contacts manager (name, email)
- Improve tutorial and comments

## Authors

* **Alex Barrios** - *Improvements and Fixes over the original source* - [alexertech](https://github.com/alexertech)
* **Scotch.IO** - *Original Tutorial* - [scotch.io](https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the GNU General Public License V3.0 - see the [LICENSE.md](LICENSE.md) file for details.

Please if you use the project, say HI! in [twitter](http://twitter.com/alexertech) :)

### Walkthrough First steps with MEAN

The current status of the repository have a different version of the first steps Walkthrough, but if you want to start with a very basic setup you can follow this steps.

First, lets create the structure for our app:

```
$ mkdir mean
$ cd mean/
$ mkdir public
$ touch public/core.js
$ touch public/index.html
$ touch server.js
$ touch package.json
```

## npm configuration

Required to install dependencies/modules

```
  {
    "name"         : "node-todo",
    "version"      : "0.0.0",
    "description"  : "Simple todo application.",
    "main"         : "server.js",
    "author"       : "Scotch & Alex",
    "dependencies" : {
      "body-parser"    : "^1.4.3",
      "express"        : "^4.13.4",
      "method-override": "^2.1.3",
      "mongoose"       : "^4.4.12",
      "morgan"         : "^1.1.1"
    }
  }
```

## Node Installation
Lets install node

```
  /var/www/public/mean$ npm install
```


## MongoDB for the database

```
$ export LC_ALL=C
$ mongo
MongoDB shell version: 3.0.7
connecting to: test
Welcome to the MongoDB shell.
> use MEAN_TEST
switched to db MEAN_TEST
> db
MEAN_TEST
> quit()

$ mongod
2016-06-16T01:27:43.267+0000 E NETWORK  [initandlisten] listen(): bind() failed errno:98 Address already in use for socket: 0.0.0.0:27017
2016-06-16T01:27:43.268+0000 E NETWORK  [initandlisten]   addr already in use
2016-06-16T01:27:43.271+0000 I STORAGE  [initandlisten] exception in initAndListen: 29 Data directory /data/db not found., terminating
2016-06-16T01:27:43.271+0000 I CONTROL  [initandlisten] dbexit:  rc: 100
```

## Moar node configuration

Now lets configure the basic node server in server.js

```
    // server.js

    // set up ========================
    // create our app w/ express
    var express  = require('express');
    var app      = express();
    // mongoose for mongodb
    var mongoose = require('mongoose');
    // log requests to the console (express4)
    var morgan = require('morgan');
    // pull information from HTML POST (express4)
    var bodyParser = require('body-parser');
    // simulate DELETE and PUT (express4)
    var methodOverride = require('method-override');

    // configuration =================

    // connect to mongoDB database
    mongoose.connect('mongodb://localhost/MEAN_TEST');

    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));
    // log every request to the console
    app.use(morgan('dev'));
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({'extended':'true'}));
    // parse application/json
    app.use(bodyParser.json());
    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    app.use(methodOverride());

    // listen (start app with node server.js) ==================================
    app.listen(8080);
    console.log("App listening on port 8080");
```

At this point you can run the node application. Will not return anything, but
at least we can check if is working.

```
  node server.js
```

## AngularJS for the Frontend

As our fellows at scotch.io explain:
```
Angular is on its own in the frontend. It accesses all the data it needs through
the Node API. Node hits the database and returns JSON information to Angular
based on the RESTful routing.

This way, you can separate the frontend application from the actual API. If you
want to extend the API, you can always build more routes and functions into it
without affecting the frontend Angular application. This way you can eventually
build different apps on different platforms since you just have to hit the API.
```

All our configuration for the AngularJS controller will be in the core.js file, and the output will be in the index.html on the same directory (public).

## Connecting MongoDB with Node

We need to add this to the server.js, the model will define the structure of our database in mongo.
```
(snip)

app.use(methodOverride());

// define model =================
var Todo = mongoose.model('Todo', {
  text : String
});

// listen (start app with node server.js) ==================================
(snip)
```

## Express for the routing in Angular:

```
(snip)

// define model =================
var Todo = mongoose.model('Todo', {
  text : String
});

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



// listen (start app with node server.js) ==================================
(snip)
```

At this point, if you run the node server, everything should work smoothly.
