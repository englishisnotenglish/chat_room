require('babel-polyfill');

const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

//基本的配置
module.exports = Object.assign({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: process.env.APIPORT,
    app: {
        title: 'chat room',
        description: 'a chat room created by Wang jianzhong',
        head: {
            titleTemplate: 'chat room',
            meta: [
                {name: 'description', content: 'a chat room created by Wang jianzhong.'},
                {charset: 'utf-8'},
                {property: 'og:site_name', content: 'chat room'},
                {property: 'og:locale', content: 'cn'},
                {property: 'og:title', content: 'a chat room.'},
                {property: 'og:description', content: 'a chat room created by Wang jianzhong.'},
                {property: 'og:card', content: 'summary'},
                {property: 'og:site', content: '@zhong'},
                {property: 'og:creator', content: '@zhong'},
                {property: 'og:image:width', content: '200'},
                {property: 'og:image:height', content: '200'}
            ]
        }
    },
}, environment);
