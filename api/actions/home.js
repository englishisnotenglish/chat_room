var fs = require('fs');
var path = require('path');
export default function home (){
    return new Promise((resolve) => {
        var filePath = path.resolve(__dirname, './navigate.json');
        var navigate = fs.readFileSync(filePath);
        resolve(JSON.parse(navigate));
    });
}