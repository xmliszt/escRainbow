const db = require('../static/js/db').dbUtils;
var cryption = require("simple-crypto-js").default;
const _secretKey_a = "someSecretAboutAlphaSUTD2020C1G9~!@";
const _secretKey_b = "@#$430dfjasdf012831dafJELJlkfnf1-ijflkn";
var Crypto = new cryption(_secretKey_a);
var Crypto_PWD = new cryption(_secretKey_b)
var username = "admin";
var password = "~!@SUTDsutd123";

var EUsername = Crypto.encrypt(username);
var EPassword = Crypto_PWD.encrypt(password);

var admin = {
    id: EUsername,
    username: "admin",
    password: EPassword,
    firstName: "admin",
    lastName: "admin"
};

db.insert(admin, "Users");
