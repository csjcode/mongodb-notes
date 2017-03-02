# Mongodb Class notes

* source class: https://www.udemy.com/the-complete-developers-guide-to-mongodb/learn/v4/t/lecture
* extra code: https://github.com/StephenGrider/MongoCasts/

## Aside on Mocha testing pattern:  

**describe** (the general category name with many it-blocks)
--> **it** (a specific test block)
---> **assertion** (the code being tested)

example:
```javascript
describe('Creating records', () => {
  it('saves a user', () => {
    assert(1+1 === 3)
  });
});
```

* Edit the package.json file

```javascript
"scripts": {
  "test": "mocha"
},
```


* `> npm run test`


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

----------------------------------

# Mocha pattern:  

**describe** (the general category name with many it-blocks)
--> **it** (a specific test block)
---> **assertion** (the code being tested)

example:
```javascript
describe('Creating records', () => {
  it('saves a user', () => {
    assert(1+1 === 3)
  });
});
```

* Edit the package.json file

```javascript
"scripts": {
  "test": "mocha"
},
```


* `> npm run test`


----------------------------------

### 20. Running Mocha Tests


```javascript
const assert = require('assert');
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', () => {
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


```javascript
const assert = require('assert');
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', () => {
    const joe = new User({ name: 'Joe' });

  });
});
```

* HOWEVER, this does not save joe to database.

----------------------------------

###  22. Saving Users to Mongo

Here is how we save joe to the database.
`joe.save()`

So full code:

```javascript
const assert = require('assert');
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', () => {
    const joe = new User({ name: 'Joe' });
    joe.save()
  });
});
```

Two items to be aware of:

1. This does not have assert, so there is no assertion being tested.
1. This will save to the db multiple times

----------------------------------

### 23. Dropping Collections 4:48

* We need to empty out the DB each time we start the tests
* We use a "hook" to define emptying the collection whenever we tests
* In test_helper.js:

```javascript
beforeEach(() => {
  mongoose.connection.collections.users.drop();
});

```

* However, if we have many users this could be a problem because we need to tell Mocha to pause until it is completely empty.
*

----------------------------------

### 24. Mocha's Done Callback 4:56

* We need a "done" callback that tells us when emptying the DB is done.
* see 24-Done-Callback
* Every line of code sent through Mocha get a "done" callback
* You can add it as an argument to the function being called.
```javascript
beforeEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    done();
  });
});

```

----------------------------------

### 25. Mongoose's isNew Property 6:25

* We now need to make an actual assertion to make sure joe is getting saved.
* We can set this up as a promise.
* Mongoose has a built-in property called isNew===true, a flag which be on the model if it is not in Mongo yet
* Once the model is saved in Mongo, it will be flipped to isNew===false.
* Assert inside a promise `assert(!joe.isNew);`

```javascript
describe('Creating records', () => {
  it('saves a user', (done) => {
    const joe = new User({ name: 'Joe' });
    joe.save()
      .then(() => {
        assert(!joe.isNew);
        done();
      });
  });
});
```

`npm run test` - success

If we change it to `assert(joe.isNew);` then we shoudl see the test fail

`npm run test` - fail

----------------------------------

### 26. Default Promise Implementation 6:45

* All we have to do is add to top of test_helper:
`mongoose.Promise = global.Promise;`
* Remove good to go msg

ERROR NOTE
* Got an error msg DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead:
* RESOLUTION: This has something to do with a new version of Mongoose.
* It can be resolved by adding to user.js, not just the helper file `mongoose.Promise = global.Promise;`

* Also we want to wrap our connect statement in a before call (not beforeEach), because it;s used one time, not each time.

```javascript
before((done) => {
  mongoose.connect('mongodb://localhost/users_test');
```

----------------------------------

### 27. Test Setup for Finding Users 6:38

* We are now going to query users.
* Right now we can query by name or _id
* In reading_test.js, make a block similar to the create_test... HOWEVER,
* For scope, since we have 2 function blocks, declare `let joe;` inside the main block and outside the 2 it-blocks
* And add:

```javascript
it('finds all users with a name of joe', (done) => {
  User.find({ name: 'Joe' })
    .then((users) => {
      console.log(users);
      done();
    });
});
```

----------------------------------

### 28. Making Mongo Queries 6:00


----------------------------------

### 29. The ID Property - A Big Gotcha 6:24


----------------------------------

### 30. Automating Tests with Nodemon 4:57


----------------------------------

### 31. Finding Particular Records 5:04


----------------------------------

### 32. The Many Ways to Remove Records 9:54


----------------------------------

### 33. Class Based Removes 5:10


----------------------------------

### 34. More Class Based Removals 5:46


----------------------------------

### 35. The Many Ways to Update Records 3:59

----------------------------------

### 36. Set and Save for Updating Records 8:20

----------------------------------

### 37. Model Instance Updates 7:38

----------------------------------

### 38. Class Based Updates 8:50


----------------------------------

## Mongo Operators


----------------------------------

### 39. Update Operators 11:15

----------------------------------

### 40. The Increment Update Operator 6:17

----------------------------------

### 41. Validation of Records 5:03

----------------------------------

### 42. Requiring Attributes on a Model 11:15

----------------------------------

### 43. Validation With a Validator Function 6:40

----------------------------------

### 44. Handling Failed Inserts 4:19



----------------------------------


## Handling Relational Data


----------------------------------

### 45. Embedding Resources in Models 5:17

----------------------------------

### 46. Nesting Posts on Users 5:40

----------------------------------

### 47. Testing Subdocuments 7:29

----------------------------------

### 48. Adding Subdocuments to Existing Records 11:27

----------------------------------

### 49. Removing Subdocuments 7:46

----------------------------------

### 50. Virtual Types 7:59

----------------------------------

### 51. Defining a Virtual Type 6:19

----------------------------------

### 52. ES6 Getters 8:16

----------------------------------

### 53. Fixing Update Tests

----------------------------------

## Thinking About Schema Design

----------------------------------

### 54. Challenges of Nested Resources 5:27

----------------------------------

### 55. Embedded Documents vs Separate Collections 7:55

----------------------------------

### 56. BlogPosts vs Posts 3:26

----------------------------------

### 57. Creating Associations with Refs 8:53

----------------------------------

### 58. Test Setup for Associations 5:12

----------------------------------

### 59. Wiring Up Has Many and Has One Relations 8:40

----------------------------------

### 60. Promise.All for Parallel Operations 6:44

----------------------------------

### 61. Populating Queries 11:06

----------------------------------

### 62. Loading Deeply Nested Associations 12:12


## Mongoose Middleware

----------------------------------

### 63. Cleaning Up with Middleware 4:42

----------------------------------

### 64. Dealing with Cyclic Requires 5:07

----------------------------------

### 65. Pre-Remove Middleware 5:58

----------------------------------

### 66. Testing Pre-Remove Middleware 5:46
