import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from 'utils/url.js';
import PrettyError from 'pretty-error';
import Https from 'https';
import SocketIo from 'socket.io';
import fs from 'fs';
import path from 'path';
import router from './routes/router'


const pretty = new PrettyError();
const app = express();


var privateKey  = fs.readFileSync(path.resolve(__dirname, '../static/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, '../static/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};
const server = new Https.Server(credentials, app);

const io = new SocketIo(server);
io.path('/ws');

app.use(session({
    secret: 'react and redux rule!!!!',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

//app.use(express.static(__dirname + '/mock'));
app.use(bodyParser.json());

app.use('/mock', router);
app.use('/', (req, res) => {
    const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

    const {action, params} = mapUrl(actions, splittedUrlPath);

    if (action) {
        action(req, params)
            .then((result) => {
                if (result instanceof Function) {
                    result(res);
                } else {
                    res.json(result);
                }
            }, (reason) => {
                if (reason && reason.redirect) {
                    res.redirect(reason.redirect);
                } else {
                    console.error('API ERROR:', pretty.render(reason));
                    res.status(reason.status || 500).json(reason);
                }
            });
    } else {
        res.status(404).end('NOT FOUND');
    }
});

const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
    const runnable = app.listen(config.apiPort, (err) => {
        if (err) {
            console.error(err);
        }
        console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
        console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
    });

    io.on('connection', (socket) => {
        socket.emit('news', {msg: `'Hello World!' from server`});

        socket.on('history', () => {
            for (let index = 0; index < bufferSize; index++) {
                const msgNo = (messageIndex + index) % bufferSize;
                const msg = messageBuffer[msgNo];
                if (msg) {
                    socket.emit('msg', msg);
                }
            }
        });

        socket.on('msg', (data) => {
            console.log(data);
            //data.id = messageIndex;
            //messageBuffer[messageIndex % bufferSize] = data;
            //messageIndex++;
            io.emit('msg', data);
        });
    });
    io.listen(runnable);
} else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
}
