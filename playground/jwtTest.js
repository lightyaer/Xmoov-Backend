const jwt = require('jsonwebtoken');

let data = {
    id: "123123",
    name: "DJ"
}

let token = jwt.sign(data,"lsakhfijsgbfkcnsk;cn").toString();


let payload = jwt.verify(token,"lsakhfijsgbfkcnsk;cn");
console.log(token);
console.log(payload);