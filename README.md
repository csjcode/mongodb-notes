# mongodb-notes

* Class notes

----------------------------------

### 12 - Collections

* Make multiple Databases - multiple applications each with a database
* see Collections image & 12-Databases.png
* Before creating Collections, we'll come up with a schema



### 13 - CRUD
* 13-Core-Mongo-Mongoose.png
* Create, Read, Update, Destroy
* `> mkdir users`

### 14 - Project Overview
* `npm init`
* enter through eveything
* Install 3 new packages
* `> npm install --save mocha nodemon mongoose`
* 14-Application-Overview.png
* 14-Project-Strucure.png
* /src/user.js - code to wire mongo and mongoose together
* /test/create_test.js, /test/read_test.js, /test/update_test.js /test/destroy_test.js

### 15. The Test Helper File
* Mocha is the most popular for Javascript testing in Node
* Create new files
* Initial test code setup
* We need to connect Mongoose to Mongo
* Test code to check Mongo Mongoose connection
* We're going to create a test_helper.js
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://locahost/users_test');
mongoose.connection
  .once('open', () => console.log('Good to go!'))
  .on('error', (error) => {
    console.warn('Warning', error);
  });
```

### 16. Mongoose Connection Helper

* Node.js require mongoose into file
* mongoose.connect - how we connect to mongo and where to connect (what server/db)
* Note: We do not have to create a database ahead of time - the connect statement will create it if not there.
`>node test\test_helper.js`
`Good to go!`
* see if it works with this locahost typo: `mongoose.connect('mongodb://locahost/users_test');`
`Warning { MongoError: failed to connect to server [locahost:27017] on first connect`

### 17. Mongoose Models

* Next we want to add a new collection of users.


















### 18. More on Models
### 19. The Basics of Mocha

### 20. Running Mocha Tests
