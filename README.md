# ESC Project Alpha -- Routing Engine for Bank Industry using Rainbow Services

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[TOC]

#### the master branch is in development environment!


## Access The Website

https://alpha-holding.herokuapp.com/

## Final Project Report

https://docs.google.com/document/d/1jXOXUDD9_DxxlOv1kN3OtP0ftsphTvbtucvVDYqSE5U/edit?usp=sharing

## Jest Testing

Install relevant dependencies for testing.

```bash
npm install --save-dev babel-cli babel-preset-env jest supertest superagent
npm audit fix
```

Add this to your `package.json`
```bash
{
  "scripts": {
    "test": "jest"
  }
}
```

to run simply
```bash
npm run test
```
to run code coverage simply
```bash
npm test -- coverage
```

## MongoDB Schema

* Collection name: "Agents"

```JSON
{
    name: [String],
    skill: [Number],
    id: [String],
    email: [String],
    busy: [Boolean],
    priority: [Number]
}
```

​	example:

```json
{
    name: "Michalina Hebert",
    skill: 2,
    id: "5e5e23516c332176648fe58e",
    email: "agent1@alpha.com",
    busy: false,
    priority: 0
}
```

* Collection name: "Users"

```JSON
{
    username: [String],
    firstname: [String],
    lastname: [String],
    email: [String],
    password: [String]
}
```

​	example:
```JSON
{
    username: "alphaTest",
    firstname: "Alpha",
    lastname: "Go",
    email: "alpha_go@alpha.com",
    password: "4243@##$daf3124$351E213"
}
```

## Alpha API

### Render Home Page

Render Alpha bank home page without any login
| | |
|:--|:----------------------:|
|URL|`/`|
|Method|`GET`|
|URL Params| None|
|Data Params| None|
|Success Response (code)| 200 OK|
|Success Response (content)| "home.ejs" text/html |
|Error Response (code)| 404 NOT FOUND|
|Error Response (content)|{error: [String]}|

- Sample Call

```js
$.ajax({
  url: "/",
  type: "GET",
  success: function(data, status, r) {
    console.log(status);
  }
});
```

### Login Bank Account

Log in a user to its bank account [Differentiate this with "Login Guest", which is for the Rainbow side]

When user logged in using its username and password, they are sent to backend to do verification. If success, the user's firstName and lastName stored in database will be returned.

A Auth token will be generated and stored in the cookie

https://stackoverflow.com/questions/12840410/how-to-get-a-cookie-from-an-ajax-response
| | |
| :------------------------- | :-----------------------------------------: |
| URL                        |                  `/login`                  |
| Method                     |                   `POST`                    |
| URL Params                 |                    None                     |
| Data Params                | `{username: [String], password: [String]}`  |
| Success Response (code)    |                   200 OK                    |
| Success Response (content) | `{loggedIn: [boolean], firstName: [String], lastName: [String]}` |
| Error Response (code)      |          500 INTERNAL SERVER ERROR          |
| Error Response (content)   |         {error: "User not found!"}          |

- Sample Call

```js
$.ajax({
  url: "/",
  type: "POST",
  data: { username: "amyTan2012", password: "iloverainbow" },
  success: function(data, status, r) {
    if (data.loggedIn){
      console.log("Logged In!");
      console.log(`First Name: ${data.firstName} Last Name: ${data.lastName}`);
    } else {
      console.log("Password wrong!");
    }
  }
});
```

### Bank Account Registration

New user register for a bank account, information will be submitted to MongoDB at Bankend
| | |
|:--|:----------------------:|
|URL|`/register`|
|Method|POST|
|URL Params|None|
|Data Params| `{username: [String], password: [String], firstName: [String], lastName: [String]}` |
|Success Response (code)| 200 OK|
|Success Response (content)| `{success: 1}` |
|Error Response (code)|500 INTERNAL SERVER ERROR|
|Error Response (content)|`{error: "Registration failed! " + <errorMessage>}`|

- Sample Call

```js
$.ajax({
  url: "/register",
  type : "POST",
  data: {username: "xmlist", password: "whatever", firstName: "David", lastName: "Lee"}
  success : function(data, status, r) {
    console.log(status);
  }
});
```

### Logout Bank Account

Logout the current logged in bank account
| | |
|:--|:----------------------:|
|URL|`/logout`|
|Method|`GET`|
|URL Params|None|
|Data Params| None|
|Success Response (code)| 200 OK|
|Success Response (content)| `{success: 1}` |
|Error Response (code)|None|
|Error Response (content)|None|

- Sample Call

```js
$.ajax({
  url: "/logout",
  type: "GET",
  success: function(data, status, r) {
    console.log(status);
  }
});
```

### Create Anonymous Guest User at Rainbow

User opens chat panel, backend create anonymous guest user in Rainbow and pass to frontend
| | |
|:--|:----------------------:|
|URL|`/chat`|
|Method|GET|
|URL Params| None |
|Data Params|None|
|Success Response (code)| 200 OK|
|Success Response (content)|`{data: [Object]}`|
|Error Response (code)|501 NOT IMPLEMENTED|
|Error Response (content)|`{error: "Failed to create user! " + <errorMessage>}`|

- Sample Call

```js
$.ajax({
  url: "/chat",
  type: "GET",
  success: function(data, status, r) {
    console.log(status);
    var credentials = data.data;
  }
});
```

### Connect to agents on Rainbow

User selects "chat with agent", backend find available agent and return 

|                            |                                                            |
| :------------------------- | :--------------------------------------------------------: |
| URL                        |                         `/connect`                         |
| Method                     |                            POST                            |
| URL Params                 |                            None                            |
| Data Params                |                   `{request: [Integer]}`                   |
| Success Response (code)    |                           200 OK                           |
| Success Response (content) |                     `{info: [Object]}`                     |
| Error Response (code)      |       501 NOT IMPLEMENTED, 500 INTERNAL SERVER ERROR       |
| Error Response (content)   | `{error: "No available agent found!"}`, `{error: [error]}` |

- Sample Call

```js
$.ajax({
  url: "/connect",
  type: "POST",
  data: { request: 0 },
  success: function(data, status, r) {
    var info = data.info;
  },
  error: function(error){
    if (error.status == 501){
        console.info(error.responseJSON.error);
    } else {
        console.info(error.responseJSON.error);
    }
  }
});
```

### Disconnect from Agent

Update agent's availability status
| | |
| :------------------------- | :------------------------------------------------------------: |
| URL | `/disconnect` |
| Method | POST |
| URL Params | None |
| Data Params | `{agentID: [String]}` |
| Success Response (code) | 200 OK |
| Success Response (content) | `{id: [String]}` |
| Error Response (code) | 501 |
| Error Response (content) | `{error: "Failed to update agent" + <errorMessage>}` |

- Sample Call

```js
$.ajax({
  url: "/disconnect",
  type: "POST",
  success: function(data, status, r) {
    console.log(data.id);
  }
});
```

### Check Logged In status

Check if user is logged in.

|                            |                                         |
| :------------------------- | :-------------------------------------: |
| URL                        |                 `/auth`                 |
| Method                     |                   GET                   |
| URL Params                 |                  None                   |
| Data Params                |                  None                   |
| Success Response (code)    |                 200 OK                  |
| Success Response (content) | `{loggedIn: [boolean], user: [Object]}` |
| Error Response (code)      |            401 UNAUTHORIZED             |
| Error Response (content)   |   `{error: "Unauthenticated access!}`   |

- Sample Call

```js
$.ajax({
  url: "/auth",
  type: "GET",
  success: function(data, status, r) {
    if (data.loggedIn) {
      //do something if logged in
    }
  },
  error: function(error){
    if (error.status == 401){
      //do something if not logged in
    }
  }
});
```

### Admin: Login Page Rendering

Render the admin login page

|                            |               |
| :------------------------- | :-----------: |
| URL                        |     `/su`     |
| Method                     |      GET      |
| URL Params                 |     None      |
| Data Params                |     None      |
| Success Response (code)    |    200 OK     |
| Success Response (content) |  'text/html'  |
| Error Response (code)      | 404 NOT FOUND |
| Error Response (content)   |     None      |

- Sample Call

```js
$.ajax({
  url: "/su",
  type: "GET",
  success: function(data, status, r) {
      //do something if logged in
  },
  error: function(error){
      //do something if not logged in
  }
});
```



### Admin: Login 

Login in to admin

|                            |                                            |
| :------------------------- | :----------------------------------------: |
| URL                        |                   `/su`                    |
| Method                     |                    POST                    |
| URL Params                 |                    None                    |
| Data Params                | `{username: [String], password: [String]}` |
| Success Response (code)    |                   200 OK                   |
| Success Response (content) |           "Login Successfully!"            |
| Error Response (code)      |              401 UNAUTHORIZED              |
| Error Response (content)   |                  [String]                  |

- Sample Call

```js
$.ajax({
  url: "/su",
  type: "POST",
  data: {
    username: "test@mail.com",
    password: "abcdefg123"
  },
  success: function(data) {
      //do something if logged in
  },
  error: function(error){
      if (error.status === 401){
          // do something if not logged in
      }
  }
});
```

### Admin: Render Dashboard

Render the admin dashboard

|                            |                        |
| :------------------------- | :--------------------: |
| URL                        |    `/su/dashboard`     |
| Method                     |          GET           |
| URL Params                 |          None          |
| Data Params                |          None          |
| Success Response (code)    |         200 OK         |
| Success Response (content) |      'text/html'       |
| Error Response (code)      |    401 UNAUTHORIZED    |
| Error Response (content)   | "Unauthorized access!" |

- Sample Call

```js
$.ajax({
  url: "/su/dashboard",
  type: "GET",
  success: function(data, status, r) {
      //do something if authenticated
  },
  error: function(error){
      //do something if not authorized
      if (error.status === 401){
          
      }
  }
});
```

### Admin: Create Agent

create agent and add to database

|                            |                                                              |
| :------------------------- | :----------------------------------------------------------: |
| URL                        |                         `/su/create`                         |
| Method                     |                             POST                             |
| URL Params                 |                             None                             |
| Data Params                | `{email: [String], password: [String], firstname: [String], lastname: [String]}, skill: [Number]` |
| Success Response (code)    |                            200 OK                            |
| Success Response (content) |                `{agent: [Object]}`                |
| Error Response (code)      |            401 UNAUTHORIZED, 500 NOT IMPLEMENTED             |
| Error Response (content)   |         "Unauthorized access!", `{error: [Object]}`          |

- Sample Call

```js
$.ajax({
  url: "/su/create",
  type: "POST",
  data: {
    email: "test@alpha.com",
    password: "123456",
    firstname: "Test",
    lastname: "Test",
    skill: 1
  },
  success: function(data) {
      //do something if created successfully
      var agentObject = data.agent;
  },
  error: function(error){
      if (error.status === 401){
          //do something if not authorized
      } else if (error.status === 500){
          //do something if not implemented
      }
  }
});
```

### Admin: Delete Agent

create agent and add to database

|                            |                                                              |
| :------------------------- | :----------------------------------------------------------: |
| URL                        |                         `/su/dashboard/delete`  |
| Method                     |                             GET                             |
| URL Params                 |                             `{id: [String: agent's id]}`                             |
| Data Params                |      |
| Success Response (code)    |                            200 OK                            |
| Success Response (content) |                "Deleted!"                 |
| Error Response (code)      |           500 NOT IMPLEMENTED             |
| Error Response (content)   |         `{error: [Object]}`          |

- Sample Call

```js
$.ajax({
  url: "/su/dashboard/delete?id=13dfa@34dfja2f",
  type: "GET",
  success: function(data) {
      //do something if deleted successfully
  },
  error: function(error){
      //do something if failed to delete
  }
});
```

### Admin: Get all agent data information

Retrieve information about agent from backend database

|                            |                                   |
| :------------------------- | :-------------------------------: |
| URL                        |       `/su/dashboard/data`        |
| Method                     |                GET                |
| URL Params                 |               None                |
| Data Params                |               None                |
| Success Response (code)    |              200 OK               |
| Success Response (content) | `Arrays[[Object], [Object], ...]` |
| Error Response (code)      |        500 NOT IMPLEMENTED        |
| Error Response (content)   |        `{error: [Object]}`        |

- Sample Call

```js
$.ajax({
  url: "/su/dashboard/data",
  type: "GET",
  success: function(data) {
      data.forEach((element, index) => {
          //do something with each data in the array
      });
  },
  error: function(error){
      if (error.status === 500){
          //do something if not implemented
      }
  }
});
```



## License & Copyright

© ESCC1G9, Singapore University of Technology and Design

Licensed under the [MIT License](LICENSE)
