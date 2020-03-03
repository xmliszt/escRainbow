const USER = "yuxuan_li@mymail.sutd.edu.sg";
const PWD = "jTijtM1oXr~4";
const APPID = "47a88e404ed911ea819a43cb4a9dae9b";
const SECRET = "GXWv2NNkOnZ573jTlLo6vq3vc05PEgiObRGf0jAWfTXYe01LkN72kzGpXkkpvqf9";
let KEY = "sutd20alpha";

let options = {
    rainbow: {
        host: "sandbox"
    },
    credentials: {
        login: USER, // To replace by your developer credendials
        password: PWD // To replace by your developer credentials
    },
    // Application identifier
    application: {
        appID: APPID,
        appSecret: SECRET
    },
    // Logs options
    logs: {
        enableConsoleLogs: true,
        enableFileLogs: false,
        "color": true,
        "level": 'debug',
        "customLabel": "vincent01",
        "system-dev": {
            "internals": false,
            "http": false,
        }, 
        file: {
            path: "/var/tmp/rainbowsdk/",
            customFileName: "R-SDK-Node-Sample2",
            level: "debug",
            zippedArchive : false/*,
            maxSize : '10m',
            maxFiles : 10 // */
        }
    },
    // IM options
    im: {
        sendReadReceipt: true
    }
};

exports.cred = options;