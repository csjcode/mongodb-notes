# mongodb-notes

* Class notes

----------------------------------

### 12 - Collections

* Make multiple Databases - multiple applications each with a database
* see Collections image & 12-Databases.png
* Before creating Collections, we'll come up with a schema

----------------------------------

### 13 - CRUD
* 13-Core-Mongo-Mongoose.png
* Create, Read, Update, Destroy
* `> mkdir users`

----------------------------------

### 14 - Project Overview
* `npm init`
* enter through eveything
* Install 3 new packages
* `> npm install --save mocha nodemon mongoose`
* 14-Application-Overview.png
* 14-Project-Strucure.png
* /src/user.js - code to wire mongo and mongoose together
* /test/create_test.js, /test/read_test.js, /test/update_test.js /test/destroy_test.js

----------------------------------

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

----------------------------------

### 16. Mongoose Connection Helper

* Node.js require mongoose into file
* mongoose.connect - how we connect to mongo and where to connect (what server/db)
* Note: We do not have to create a database ahead of time - the connect statement will create it if not there.
`>node test\test_helper.js`
`Good to go!`
* see if it works with this locahost typo: `mongoose.connect('mongodb://locahost/users_test');`
`Warning { MongoError: failed to connect to server [locahost:27017] on first connect`

----------------------------------

### 17. Mongoose Models

* Next we want to add a new collection of users.
* see: 17-User-Model-Schema.png
* We're going to uas a "schema", in this case "User Model" to create "User instances". A lot of instances = collection.

----------------------------------

### 18. More on Models

* Create a new user model: user.js
* Add to the top of the file (almost always when working with mongo): `const mongoose = require('mongoose');`
* Also, add `const Schema = mongoose.Schema;` - this is what we use to create the User model
* Create a new Schema
```javascript
const UserSchema = new Schema({
  name: String
});
```
* Schema is juts one part of the overall User model
```javascript
const User = mongoose.model('user', UserSchema);
module.exports = User;
```
* This just names the database (user), and specifies which model to follow.
* Every time e use Mongoose it will have this sort of file, similar lines of code


----------------------------------


### 19. The Basics of Mocha


* Write some code to test the Schema ni Mocha
* Make new file create_test.js
* Mocha uses the terms "Describe" and "It"

Mocha pattern:  

describe
 --> it
   --> assertion

----------------------------------

### 20. Running Mocha Tests


```javascript
const assert = require('assert');
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', () => {
    // const joe = new User({ name: 'Joe' });
    assert(1+1 === 3)
  });
});
```
* describe('Creating records') -- this is just a label, not part of the actual test
* it-block kicks off the test
* All it functions will be queued up and will write them one at a time.
* Inside the it-block we need ot test an assertion.
* Include "assert" module
* `> npm run test` - error
* Edit the package.json file
* package.json (replace the default test script with mocha):
```javascript
"scripts": {
  "test": "mocha"
},
```
* `> npm run test` - Passing (an test by changing to 3 and it says Fail)


----------------------------------

### 21. Creating Model Instances
