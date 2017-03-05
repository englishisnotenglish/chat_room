require('babel-polyfill');

//webpack config for dev
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = process.env.host || 'localhost';
var port = process.env.port || 3001;

//isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tool/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

//将babel配置里面的配置合并
var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
    babelrcObject = JSON.parse(babelrc);
} catch (err) {
    console.error('解析你的babel文件失败，检查你的格式');
    console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

//close server HMR manually
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var pluginsLength = babelLoaderQuery.plugins.length;
var reactTransform = null;
for (var i = 0; i < pluginsLength; i++) {
    var plugin = babelLoaderQuery.plugins[i];
    if(Array.isArray(plugin) && plugin[0] === 'react-transform'){
        reactTransform = plugin;
    }
}

if(!reactTransform) {
    reactTransform = ['react-transform', {transforms: []}];
    babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
    reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
    transform: 'react-transform-hmr',
    imports: ['react'],
    locals: ['module']
});

module.exports = {
    entry: {

    },
    output: {

    }

}
