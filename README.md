# ESC Project Alpha -- Routing Engine for Bank Industry using Rainbow Services

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## How To Run

_Make sure you have MongoDB installed before running_

```bash
git clone https://github.com/xmliszt/escRainbow.git
cd escRainbow
npm install
node app
```

## Project Brief

- Front-end:
  - UI for bank customers to make queries
  - Bot auto reply
  - Notify back-end when human agents are requested
- Back-end:
  - Manage agents queue
  - Database to store agents information
  - Link front-end user's message to the agent via Rainbow services

## Updates

### 2020/03/03 Yuxuan

- Set up simple chat UI page for developing chatting service
- Explore ExpressJS and EJS framework
- Learn about Async methods and JQuery
- Basic UI allows user to input names and create Guest account through RainbowSDK

### 2020/03/04 Yuxuan

- Implement MongoDB to store User and Agent information
- Backend successfully receive requests from Frontend and send back responses accordingly
- Frontend achieves Asynchronously update message bubbles and continuous chatting
- When the guest leaves the chat, his data will be removed from MongoDB as well as deleted from Rainbow

### 2020/03/05 Yuxuan

- Customer interface to simulate signin as Guest User on Rainbow
- Chat panel for sending chat bubbles async
- Sample choices for customer to select for queries
- Dynamic binding of Frontend js functions to elements
- Utility functions to help creating dynamic elements at frontend easier :)
- Exit to clear data from MongoDB as well as remove account from Rainbow
- Implementation of Queue class established. Utility methods for MongoDB functionality

### 2020/03/10 Team

- TODO

## Routes

### `/agent` GET [Agent connection request, dequeue the request]

### `/loan` GET [backend check against session see if user is logged in. If not cannot proceed with loan response]

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

|                            |                                             |
| :------------------------- | :-----------------------------------------: |
| URL                        |                   /login                    |
| Method                     |                   `POST`                    |
| URL Params                 |                    None                     |
| Data Params                | `{username: [String], password: [String]}`  |
| Success Response (code)    |                   200 OK                    |
| Success Response (content) | `{firstName: [String], lastName: [String]}` |
| Error Response (code)      |          500 INTERNAL SERVER ERROR          |
| Error Response (content)   |         {error: "User not found!"}          |

- Sample Call

```js
$.ajax({
  url: "/",
  type: "POST",
  data: { username: "amyTan2012", password: "iloverainbow" },
  success: function(data, status, r) {
    console.log(`First Name: ${data.firstName} Last Name: ${data.lastName}`);
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
|Error Response (code)|501 INTERNAL SERVER ERROR|
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

### Queue user's agent call request

User selects "chat with agent", backend receive query skill type and user ID (rainbow guest account). Backend queue the request object.

|                            |                                                             |
| :------------------------- | :---------------------------------------------------------: |
| URL                        |                          /request                           |
| Method                     |                            POST                             |
| URL Params                 |                            None                             |
| Data Params                |            `{id: [String], request: [Integer]}`             |
| Success Response (code)    |                           200 OK                            |
| Success Response (content) |                       `{success: 1}`                        |
| Error Response (code)      |                  501 INTERNAL SERVER ERROR                  |
| Error Response (content)   | `{error: "Failed to queue the request! " + <errorMessage>}` |

- Sample Call

```js
$.ajax({
  url: "/request",
  type: "POST",
  data: { id: "dafljadlfjer30u1f", request: 0 },
  success: function(data, status, r) {
    console.log(status);
  }
});
```

### Make connection with available agent

Frontend signal the need for connecting an agent. Backend serve the queue to matching agent

|                            |                                                      |
| :------------------------- | :--------------------------------------------------: |
| URL                        |                        /agent                        |
| Method                     |                         GET                          |
| URL Params                 |                         None                         |
| Data Params                |                         None                         |
| Success Response (code)    |                        200 OK                        |
| Success Response (content) |       `{agentID: [String], skill: [Integer]}`        |
| Error Response (code)      |              501 INTERNAL SERVER ERROR               |
| Error Response (content)   | `{error: "Failed to call agent! " + <errorMessage>}` |

- Sample Call

```js
$.ajax({
  url: "/agent",
  type: "GET",
  success: function(data, status, r) {
    var agentID = data.agentID;
    var skill = data.skill;
    // search for agent in Rainbow and open conversation
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
| URL                        |                             /check                             |
| Method                     |                              GET                               |
| URL Params                 |                              None                              |
| Data Params                |                              None                              |
| Success Response (code)    |                             200 OK                             |
| Success Response (content) | `{success: 1} if logged in` or `{success: 0} if not logged in` |
| Error Response (code)      |                              None                              |
| Error Response (content)   |                              None                              |

- Sample Call

```js
$.ajax({
  url: "/check",
  type: "GET",
  success: function(data, status, r) {
    if (data.success) {
      //do something if logged in
    } else {
      //do something if not logged in
    }
  }
});
```

## License & Copyright

© ESCC1G9, Singapore University of Technology and Design

© ESCC1G9, Singapore University of Technology and Design

Licensed under the [MIT License](LICENSE)
