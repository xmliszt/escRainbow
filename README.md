# ESC Project Alpha -- Routing Engine for Bank Industry using Rainbow Services
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

## How To Run
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
  
## License & Copyright
© ESCC1G9, Singapore University of Technology and Design


Licensed under the [MIT License](LICENSE)
