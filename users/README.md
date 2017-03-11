# Mongodb Class notes

* source class: https://www.udemy.com/the-complete-developers-guide-to-mongodb/learn/v4/t/lecture
* extra code: https://github.com/StephenGrider/MongoCasts/

## Aside on Mocha testing pattern:  

**describe** (the general category name with many it-blocks)  

--> [optional: before, beforeEach]  
    `beforeEach((done) => {`

----> **it** (a specific test block)  
      `it('model instance remove', (done) => { });`

------> **assertion** (the code being tested)  

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

* This will run all scripts in the test/ directory.


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

## TTD - Testing

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

### 27. Test Setup for Finding Users 6:38 - reading_test.js

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

### 28. Making Mongo Queries 6:00 - reading_test.js

* We still have to add an assert command to find all users with the name joe
* There are two main query methods we'll use with Mongoose
1. **Model.find** - we use when we want to find all of the users that match a criteria (Array)
1. **Model.findOne** - we use when we only want 1 user
* Model represent our class as described in our Schema and Schma constant variable.
* Start with the `console.log(users);`
* `npm run test`
```
  Creating records
    √ saves a user (43ms)

  Reading users out of the database
[ { _id: 58b7efd8847d4b0964bdb3e9, name: 'Joe', __v: 0 } ]
    √ finds all users with a name of joe


  2 passing (163ms)
```

* Replace the console.log(users) with `assert(users[0]._id.toString() === joe._id.toString());`

```
Creating records
  √ saves a user (50ms)

Reading users out of the database
  √ finds all users with a name of joe


2 passing (144ms)
```

----------------------------------

### 29. The ID Property - A Big Gotcha 6:24 - reading_test.js

* We found all users in our datase with the name of joe
* How do we get the unique id?
* Mongoose automatically assigned an ID, even if it is not saved yet.
* This will fail: `assert(users[0]._id === joe._id);`
* Why does this fail?
* We console log out `users[0]._id` and `joe._id`
* SAME!, but there is a Gotcha
* The id is wrapped in an object - so when comparing, it sees two diferent objects
* So that's why we need toString
* `assert(users[0]._id.toString() === joe._id.toString())`

----------------------------------

### 30. Automating Tests with Nodemon 4:57 - reading_test.js

* nodemon will watch our file for changes and run all tests automatically
* we don't use --watch because sometimes there are conflicts with mongoose
* In package.json we are going to replace test:"mocha" with
```javascript
"scripts": {
  "test": "nodemon --exec \"mocha -R min\""
},
```
* GOTCHA: single-quotes `'mocha -R min'` was originally suggested but not working in Windows.


----------------------------------

### 31. Finding Particular Records 5:04 - reading_test.js

* Now we need to find a user with a particular id

Code:
```javascript
it('find a user with a particular id', (done) => {
  User.findOne({ _id: joe._id })
    .then((user) => {
      assert(user.name === 'Joe');
      done();
    });
});
```
* We do not have to use toString because we are comparing with Mongoose, which can handle that -- not liek the previous vanilla Javascript comparison
* Assert will be set up to vrify the user id is joe.
* `npm run test` - 3 passing test

----------------------------------

### 32. The Many Ways to Remove Records 9:54 - delete_test.js

* Start out with boilerplate similar to reading_test.js to create a user
* There are at least 4 ways to remove a user:
* MODEL INSTANCE:
1. remove `instance.remove()`

* MODEL CLASS:
1. remove
1. findOneAndRemove
1. findByIdAndRemove

* Now add a `remove()` function
```javascript
it('model instance remove', (done) => {
  joe.remove()
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user === null);
      done();
    });
});
```



----------------------------------

### 33. Class Based Removes 5:10

In delete_test.js -  These are the remaining class removes:


```javascript

it('class method remove', (done) => {
  // Remove a bunch of records with some given criteria
  User.remove({ name: 'Joe' })
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user === null);
      done();
    });
});

it('class method findOneAndRemove', (done) => {
  User.findOneAndRemove({ name: 'Joe' })
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user === null);
      done();
    });
});

it('class method findByIdAndRemove', (done) => {
  User.findByIdAndRemove(joe._id)
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user === null);
      done();
    });
});

```

* NOTE: Notice that the promise part is the same for each of these. It can be copy-pasted.

* `npm run test`

```
[nodemon] starting `mocha -R min`

  7 passing (228ms)
```

----------------------------------

### 34. More Class Based Removals 5:46

----------------------------------

### 35. The Many Ways to Update Records 3:59

* Create new update_test.js

```javascript
describe('Updating records', () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    joe.save()
      .then(() => done());
  });

  it('instance type using set n save', (done) => {
    joe.set('name', 'Alex');
    joe.save()
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === 'Alex');
        done();
      });
  });
});

```

----------------------------------

### 36. Set and Save for Updating Records 8:20


* see 36-Update-models
* Set first code block

```javascript
it('instance type using set n save', (done) => {
  console.log(`original: ${joe}`);
  joe.set('name', 'Alex');
  // assertName(joe.save(), done);
  console.log(`new: ${joe}`);
});
```

* Added console logs before, after "set" - `npm run test`

```
[nodemon] starting `mocha -R min`
  original: { __v: 0, name: 'Joe', _id: 58bb7544c96f9d0b0459bc74 }
new: { __v: 0, name: 'Alex', _id: 58bb7544c96f9d0b0459bc74 }

```

* **IMPORTANT: SET** only changes what si in memory for the model, not what is in the database.

* For EXAMPLE: you may want to set up multiple sets, and then at the end do one save.

* Use **SAVE** to persist the changes in the database



`8 passing (215ms)`

----------------------------------

### 37. Model Instance Updates 7:38

* In this case we are working on a "model instance" (joe, instead of the full class User)
* For update we pass in a new object with the new properties we want.
* `joe.update({ name: 'Alex' })`


* `assertName` is a function we include above on the script:

```javascript
function assertName(operation, done) {
  operation
    .then(() => User.find({}))
    .then((users) => {
      assert(users.length === 1);
      assert(users[0].name === 'Alex');
      done();
    });
}
```

`9 passing (215ms)`

* For now on we'll be using the assertName function

----------------------------------

### 38. Class Based Updates 8:50

* We're now doing class-based updates - similar to previous.
* With class it is like we are adding in a selector, then updating the instance.

```javascript
it('A model instance can update', (done) => {
  assertName(joe.update({ name: 'Alex' }), done);
});

it('A model class can update', (done) => {
  assertName(
    User.update({ name: 'Joe' }, { name: 'Alex' }),
    done
  );
});

it('A model class can update one record', (done) => {
  assertName(
    User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
    done
  );
});

it('A model class can find a record with an Id and update', (done) => {
  assertName(
    User.findByIdAndUpdate(joe._id, { name: 'Alex' }),
    done
  );
})
```

`12 passing (394ms)`


----------------------------------

## Mongo Operators

----------------------------------

### 39. Update Operators 11:15

* We're going to look at some more complex use cases.
* New postCount property added to Schema
* see 39-postCount-New-Property-in-Schema.png

In user.js:
```javascript
const UserSchema = new Schema({
  name: String,
  postCount: Number
});
```

* Lets try a new test to increment postCount by one
* We can increment with the $inc operator
* https://docs.mongodb.com/manual/reference/operator/update/

```javascript
it('A user can have their postcount incremented by 1', () => {
  User.update({ name: 'Joe' }, { postCount: 1 });
});
```


----------------------------------

### 40. The Increment Update Operator 6:17

* Using the $inc operator
* btw, if you want to decrement, you just use -1

```javascript
User.update({ name: 'Joe' }, { $inc: { postCount: 1 } })
```

* We are not using assertName function because we are looking at the postCount, not the name.


```javascript

it('A user can have their postcount incremented by 1', (done) => {
  User.update({ name: 'Joe' }, { $inc: { postCount: 1 } })
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user.postCount === 10);
      done();
    });
});

```

`13 passing (335ms)`


----------------------------------

### 41. Validation of Records 5:03

* Mongoose is an interface wrapper for Mongo
* Mongoose has some advanced special features
* Validation (like typechecking) is useful in Mongoose.
* We want to make sure users do not submit junk data, profanity etc.
* This validation is solely implemented by Mongoose, not in Mongo
* Create file: /test/validation_test.js

```javascript
describe('Validating records', () => {
  it('requires a user name', () => {

  });
});
```
----------------------------------

### 42. Requiring Attributes on a Model 11:15

* We're writing 2 separate tests
* (1) Require a user name.
* (2) That it is at least 2 characters long
* Add a new rule in our Schema in user.js

```javascript
name: {
  type: String,
  required: [true, 'Name is required.']
},
```
* Now we want to test with undefined in the validation_test.js file

`const user = new User({ name: undefined });`

* Next we call this function which returns an object ValidationResult

`const validationResult = user.validateSync();`

* validateSync is a synchronous validation process

* check console.log to see error message
`console.log(validationResult); // shows: message: 'Name is required.'`

* Wrap this up with an assert:

```javascript
const { message } = validationResult.errors.name;
assert(message === 'Name is required.');
```



----------------------------------

### 43. Validation With a Validator Function 6:40

* Add validator function, by adding another key to the Schema object.
* We add 2 new keys (1) validator, (2) message


```javascript
const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.'
    },
    required: [true, 'Name is required.']
  },
  postCount: Number
});
```

* Now add a block to validation_test.js:

```javascript
it('requires a user\'s name longer than 2 characters', () => {
  const user = new User({ name: 'Al' });
  const validationResult = user.validateSync();
  const { message } = validationResult.errors.name;

  assert(message === 'Name must be longer than 2 characters.');
});
```


----------------------------------

### 44. Handling Failed Inserts 4:19

* In a real application, we'll rely on the validation to prevent saving to database.
* Disallow records ffrom being inserted (not just an error msg)
* We'll add a catch to make sure IF an error message comes up   

```javascript
it('disallows invalid records from being saved', (done) => {
  const user = new User({ name: 'Al' });
  user.save()
    .catch((validationResult) => {
      const { message } = validationResult.errors.name;

      assert(message === 'Name must be longer than 2 characters.');
      done();
    });
});
```

Rest on `npm run test`:

`16 passing (317ms)`



----------------------------------


## Handling Relational Data


----------------------------------

### 45. Embedding Resources in Models 5:17

* Let's add another resource in addition to our Users
* Posts - users can add posts
* In a relational database, we would have 2 different tables, one for Users and one for Posts
* In Mongo, we could still have a single collection of Users, and then have a list of Posts for each User
* So Joe could have a Post property which has an object of all his posts inside it.
* this is called **Nesting** - and one way Mongo is different from smoething like MySQL

----------------------------------

### 46. Nesting Posts on Users 5:40

* **We will have User schema and a Post schema inside the User collection**
* The Post schema whcih is being nested is considered a "subdocument".
* A model is used to corresponf to a collection. A schema is used to describe how data is getting put into that collection.
* Create new schema:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: String
});

module.exports = PostSchema;
```

* Unlike the user.js file, we did not connect to a new model, because we use the same User model., already connected in the user.js

* Now in user.js add:

`const PostSchema = require('./post');`

and under postCount a new property, which we can connect to PostSchema:

`posts: [PostSchema]`

----------------------------------

### 47. Testing Subdocuments 7:29

* Create new file called subdocument_test.js
* First setup a new user

```javascript
const joe = new User({
  name: 'Joe',
  posts: [{ title: 'PostTitle' }]
});
```

* Save and then check post title:

```javascript
joe.save()
  .then(() => User.findOne({ name: 'Joe' }))
  .then((user) => {
    assert(user.posts[0].title === 'PostTitle');
    done();
  });
```

Result:

`17 passing (351ms)`

----------------------------------

### 48. Adding Subdocuments to Existing Records 11:27

* Why should we use the subdocument if we can just add properties to a user?
* This makes it easier/cleaner to add subdocuments.
* see: 48-Adding-Subdocument-order.jpg
* to add subdocuments we have to add the subdocument, then call save on the model


```javascript
it('Can add subdocuments to an existing record', (done) => {
  const joe = new User({
    name: 'Joe',
    posts: []
  });

  joe.save()
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      user.posts.push({ title: 'New Post' });
      return user.save();
    })
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user.posts[0].title === 'New Post');
      done();
    });
});
```

IMPORTANT NOTE on promises and chaining:

this ES6 (above):
`.then(() => User.findOne({ name: 'Joe' }))`

is equivalent to t es5
`.then(() => return { User.findOne({ name: 'Joe' }) } )`

That's why above we use  `return user.save();` and can contiune to chain on the promise.

----------------------------------

### 49. Removing Subdocuments 7:46

* In this case we don't need to remove with slice, we can directly call user.posts[0] and remove it
* IMPORTANT, must REMOVE and SAVE: When we do a remove() we need to also save()

```javascript
it('can remove an existing subdocument', (done) => {
  const joe = new User({
    name: 'Joe',
    posts: [{ title: 'New Title' }]
  });

  joe.save()
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      const post = user.posts[0];
      post.remove();
      return user.save();
    })
    .then(() => User.findOne({ name: 'Joe' }))
    .then((user) => {
      assert(user.posts.length === 0);
      done();
    });
});
```

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
