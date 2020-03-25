# ESC Project Alpha -- Routing Engine for Bank Industry using Rainbow Services

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[TOC]



## How To Run

_Make sure you have MongoDB installed before running_

```bash
git clone https://github.com/xmliszt/escRainbow.git
cd escRainbow
npm install
node app
```

## MongoDB Schema

* Collection name: "Agents"

```JSON
{
    name: [String],
    skill: [Number],
    id: [String],
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
|URL|/|
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

Once logged in, backend will create cookie for this user account to be stored in the browser.

https://www.sitepoint.com/how-to-deal-with-cookies-in-javascript/
https://stackoverflow.com/questions/12840410/how-to-get-a-cookie-from-an-ajax-response 

|                            |                                             |
| :------------------------- | :-----------------------------------------: |
| URL                        |                   /login                    |
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
|URL|/register|
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
|URL|/logout|
|Method|`GET`|
|URL Params|None|
|Data Params| None|
|Success Response (code)| 200 OK|
|Success Response (content)| `{success: 1}` |
|Error Response (code)|500 INTERNAL SERVER ERROR|
|Error Response (content)|`{error: "Failed to logout! " + <errorMessage>}`|

- To get the uid, which will be stored in cookie in the browser, call `getCookie("uid")`
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
|URL|/chat|
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
| URL                        |                          /connect                          |
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
|                            |                                                                |
| :------------------------- | :------------------------------------------------------------: |
| URL                        |                             /disconnect                             |
| Method                     |                              POST                               |
| URL Params                 |                              None                              |
| Data Params                |                              `{agentID: [String]}`                              |
| Success Response (code)    |                             200 OK                             |
| Success Response (content) | `{id: [String]}` |
| Error Response (code)      |                              501                              |
| Error Response (content)   |                              `{error: "Failed to update agent" + <errorMessage>}`                              |

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

|                            |                                                                |
| :------------------------- | :------------------------------------------------------------: |
| URL                        |                             /auth                             |
| Method                     |                              GET                               |
| URL Params                 |                              None                              |
| Data Params                |                              None                              |
| Success Response (code)    |                             200 OK                             |
| Success Response (content) | `{loggedIn: [boolean], user: [Object]}` |
| Error Response (code)      |                              401 UNAUTHORIZED                              |
| Error Response (content)   |                              `{error: "Unauthenticated access!}`                              |

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

## License & Copyright

© ESCC1G9, Singapore University of Technology and Design

© ESCC1G9, Singapore University of Technology and Design

Licensed under the [MIT License](LICENSE)
