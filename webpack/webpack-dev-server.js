var Express = require('express');
var webpack = require('webpack');

var config = require('../src/config');
var webpackConfig = require('./dev.config.js');
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = Number(config.host) + 1 || 3001;

//配置开启
var serverOptions = {
    contentBase: 'http://' + host + ':' + port,
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true}
};

var app = new Express();

//使用热加载
app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('==> 🚧  Webpack development server listening on port %s', port);
    }
});
