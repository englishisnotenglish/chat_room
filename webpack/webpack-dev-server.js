var Express = require('express');
var webpack = require('webpack');

var https = require('https');
var fs = require('fs');
var path = require('path');

var config = require('../src/config');
var webpackConfig = require('./dev.config.js');
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = Number(config.host) + 1 || 3001;


//配置开启
var serverOptions = {
    contentBase: 'https://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true},
    https: true
};

var privateKey  = fs.readFileSync(path.resolve(__dirname, '../static/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, '../static/file.crt'), 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = new Express();
var server = https.Server(credentials, app);

//使用热加载
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist/jquery', function(req, res, next){
    res.sendfile(path.resolve(__dirname, './jquery.min.js'));
});

server.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('==> 🚧  Webpack development server listening on port %s', port);
    }
});
