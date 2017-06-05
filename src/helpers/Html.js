import React, {Component, PropTypes} from 'react';
import reactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

export default class Html extends Component{
    static propTypes = {
        assets: PropTypes.object,
        component: PropTypes.node,
        store: PropTypes.object
    };

    //
    // { Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{__html: require('../theme/bootstrap.config.js') + require('../containers/App/App.scss')._style}}/> : null }
    render() {
        const {assets, component, store} = this.props;
        const content  = component ? reactDOM.renderToString(component) : '';
        const head = Helmet.rewind();
        return(
            <html>
                <head>
                    {head.base.toComponent()}
                    {head.title.toComponent()}
                    {head.meta.toComponent()}
                    {head.link.toComponent()}
                    {head.script.toComponent()}

                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    {Object.keys(assets.styles).map((style, key) =>
                        <link href={assets.styles[style]} key={key} media="screen, projection"
                              rel="stylesheet" type="text/css" charSet="UTF-8"/>
                    )}


                </head>

                <body>
                    <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
                    <script src={'https://localhost:3001/dist/jquery'} charSet="UTF-8"/>
                    <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
                    <script src={assets.javascript.vendors} charSet="UTF-8"/>
                    <script src={assets.javascript.main} charSet="UTF-8"/>
                </body>
            </html>
        );
    }
}

