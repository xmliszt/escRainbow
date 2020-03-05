# ESC Project Alpha -- Routing Engine for Bank Industry using Rainbow Services
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

## How To Run
*Make sure you have MongoDB installed before running*
```bash
git clone https://github.com/xmliszt/escRainbow.git
cd escRainbow
npm install
node app
```

## Project Brief
* Front-end:
  * UI for bank customers to make queries
  * Bot auto reply
  * Notify back-end when human agents are requested
* Back-end:
  * Manage agents queue
  * Database to store agents information
  * Link front-end user's message to the agent via Rainbow services

## Updates
### 2020/03/03 Yuxuan
* Set up simple chat UI page for developing chatting service
* Explore ExpressJS and EJS framework
* Learn about Async methods and JQuery
* Basic UI allows user to input names and create Guest account through RainbowSDK
### 2020/03/04 Yuxuan
* Implement MongoDB to store User and Agent information
* Backend successfully receive requests from Frontend and send back responses accordingly
* Frontend achieves Asynchronously update message bubbles and continuous chatting
* When the guest leaves the chat, his data will be removed from MongoDB as well as deleted from Rainbow
  
## Alpha API
### Render Guest Login Page (temporary)
Render the guest login page
|   |                       |
|:--|:----------------------:|
|URL|/|
|Method|`GET`|
|URL Params| None|
|Data Params| None|
|Success Response (code)| 200 OK|
|Success Response (content)| "index.ejs" text/html|
|Error Response (code)| 404 NOT FOUND|
|Error Response (content)|None|
* Sample Call
```js
$.ajax({
  url: "/",
  type : "GET",
  success : function(data, status, r) {
    console.log(status);
  }
});
```
### Login Guest (temporary)
Take user input names and log him/her in as guest account in Rainbow
|   |                       |
|:--|:----------------------:|
|URL|/|
|Method|`POST`|
|URL Params| None|
|Data Params|`{firstN: [String], lastN: [String]}`|
|Success Response (code)| 200 OK|
|Success Response (content)| "chat.ejs" text/html|
|Error Response (code)| 501 NOT IMPLEMENTED|
|Error Response (content)| None (render "index.ejs" text/html)|
* Sample Call
```js
$.ajax({
  url: "/",
  type: "POST",
  data: {firstN: "firstName", lastN: "lastName"},
  success : function(data, status, r) {
    console.log(status);
  }
});
```
### Display chat UI for a particular user
Render the "chat" view for a user
|   |                       |
|:--|:----------------------:|
|URL|/chat/:uid|
|Method|`GET`|
|URL Params|`uid=[String]`|
|Data Params| None|
|Success Response (code)| 200 OK|
|Success Response (content)| "chat.ejs" text/html|
|Error Response (code)|500 INTERNAL SERVER ERROR|
|Error Response (content)|None (redirect to '/')|
* Sample Call
```js
$.ajax({
  url: "/chat/5e606260d8084c29e64eb64f",
  type : "GET",
  success : function(data, status, r) {
    console.log(status);
  }
});
```
### Send Message and Receive Message
Render the guest login page
|   |                       |
|:--|:----------------------:|
|URL|/chat/:uid|
|Method|`POST`|
|URL Params| `uid=[String]`|
|Data Params|`{message: [String]}`|
|Success Response (code)| 200 OK|
|Success Response (content)|`{response: [String], from: [Integer]}`|
|Error Response (code)|404 NOT FOUND|
|Error Response (content)|None|
* Sample Call
```js
$.ajax({
  url: "/chat/5e606260d8084c29e64eb64f",
  type: "POST",
  data: {message: "Hello World!"},
  success : function(data, status, r) {
    console.log(status);
    console.log(data.response);
  }
});
```
### Delete user
Remove user info from database and remove from Rainbow
|   |                       |
|:--|:----------------------:|
|URL|/delete|
|Method|`GET`|
|URL Params|None|
|Data Params|None|
|Success Response (code)| 200 OK|
|Success Response (content)|`{id:[String]}`|
|Error Response (code)|501 NOT IMPLEMENTED|
|Error Response (content)|None|
* Sample Call
```js
$.ajax({
  url: "/delete",
  type: "GET",
  success : function(data, status, r) {
    console.log(status);
    console.log(`User deleted is: ${data.id}`);
  }
});
```

## License & Copyright
© ESCC1G9, Singapore University of Technology and Design


Licensed under the [MIT License](LICENSE)
