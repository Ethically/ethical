function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const root = '../../..';
const { setProjectRoot } = require(`${root}/helper/resolve-node`);
const { absolute } = require(`${root}/helper/path`);
const createPromiseCollector = require(`${root}/helper/collect`);
const { default: PromiseProvider } = require(`${root}/react/provider`);
const getInitScripts = require(`${root}/client/scripts`);
const React = require('react');
const { createStore, combineReducers } = require('redux');
const { Provider } = require('react-redux');
const { renderToString, renderToStaticMarkup } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { Helmet } = require(`${root}/react/helmet`);
const { graphql, buildSchema } = require('graphql');

const setGlobals = request => {

    if (request) {
        global.navigator = { userAgent: request.headers['user-agent'] };
    }

    const resetProjectRoot = setProjectRoot(module.parent.parent.id);

    return () => {
        resetProjectRoot();
        delete global.navigator;
    };
};

const resolveLayoutProps = (html, store) => {
    const root = React.createElement('ethical-root', { dangerouslySetInnerHTML: { __html: html } });
    const scripts = getInitScripts(store.getState());
    const helmet = Helmet.renderStatic();
    const props = {
        html: helmet.htmlAttributes.toComponent(),
        body: helmet.bodyAttributes.toComponent(),
        title: helmet.title.toComponent(),
        meta: helmet.meta.toComponent(),
        link: helmet.link.toComponent(),
        scripts,
        root
    };
    return props;
};

const reactReduxMiddleware = async (ctx, next, config) => {
    const { method, request, response } = ctx;
    const { body } = response;
    if (body !== undefined) {
        return await next();
    }

    const { Layout, Routes, reducer, graphqlSchema, graphqlRoot } = config;
    const { url } = request;

    const promise = createPromiseCollector();
    const store = createStore(combineReducers(reducer));
    const props = await renderRoute({ url, Routes, store, promise, request });

    response.body = renderLayout(Layout, props);

    await next();
};

const renderRoute = async context => {
    const router = {};
    const props = await renderReactComponents(Object.assign({}, context, { router }));
    const { url } = router;
    if (url) {
        return renderRoute(Object.assign({}, context, { url }));
    }
    return props;
};

const renderReactComponents = async context => {

    const { url, router, Routes, store, promise, request } = context;
    const render = () => renderToString(React.createElement(
        PromiseProvider,
        { promise: promise },
        React.createElement(
            Provider,
            { store: store },
            React.createElement(
                StaticRouter,
                { context: router, location: url },
                Routes
            )
        )
    ));

    const resetGlobals = setGlobals(request);
    const html = render();
    resetGlobals();

    const promises = promise();
    const { length } = promises;
    if (length === 0) {
        return resolveLayoutProps(html, store);
    }

    await Promise.all(promises);

    const resetGlobalsAgain = setGlobals(request);
    const final = render();
    resetGlobalsAgain();

    return resolveLayoutProps(final, store);
};

const renderLayout = (Layout, props) => renderToStaticMarkup(React.createElement(Layout, Object.assign({}, props)));

const bootstrap = config => {

    const resetGlobals = setGlobals();

    const { routes, layout, reducers } = config,
          other = _objectWithoutProperties(config, ['routes', 'layout', 'reducers']);

    const { default: Layout } = require(absolute(layout));
    const { default: Routes } = require(absolute(routes));
    const { default: reducer } = require(absolute(reducers));

    resetGlobals();

    return Object.assign({ Layout, Routes, reducer }, other);
};

const reactReduxMiddlewareInit = config => {
    const resolvedConfig = bootstrap(config);
    return async (ctx, next) => await reactReduxMiddleware(ctx, next, resolvedConfig);
};

module.exports = reactReduxMiddlewareInit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci9yZWFjdC1yZWR1eC9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsicm9vdCIsInNldFByb2plY3RSb290IiwicmVxdWlyZSIsImFic29sdXRlIiwiY3JlYXRlUHJvbWlzZUNvbGxlY3RvciIsImRlZmF1bHQiLCJQcm9taXNlUHJvdmlkZXIiLCJnZXRJbml0U2NyaXB0cyIsIlJlYWN0IiwiY3JlYXRlU3RvcmUiLCJjb21iaW5lUmVkdWNlcnMiLCJQcm92aWRlciIsInJlbmRlclRvU3RyaW5nIiwicmVuZGVyVG9TdGF0aWNNYXJrdXAiLCJTdGF0aWNSb3V0ZXIiLCJIZWxtZXQiLCJncmFwaHFsIiwiYnVpbGRTY2hlbWEiLCJzZXRHbG9iYWxzIiwicmVxdWVzdCIsImdsb2JhbCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImhlYWRlcnMiLCJyZXNldFByb2plY3RSb290IiwibW9kdWxlIiwicGFyZW50IiwiaWQiLCJyZXNvbHZlTGF5b3V0UHJvcHMiLCJodG1sIiwic3RvcmUiLCJfX2h0bWwiLCJzY3JpcHRzIiwiZ2V0U3RhdGUiLCJoZWxtZXQiLCJyZW5kZXJTdGF0aWMiLCJwcm9wcyIsImh0bWxBdHRyaWJ1dGVzIiwidG9Db21wb25lbnQiLCJib2R5IiwiYm9keUF0dHJpYnV0ZXMiLCJ0aXRsZSIsIm1ldGEiLCJsaW5rIiwicmVhY3RSZWR1eE1pZGRsZXdhcmUiLCJjdHgiLCJuZXh0IiwiY29uZmlnIiwibWV0aG9kIiwicmVzcG9uc2UiLCJ1bmRlZmluZWQiLCJMYXlvdXQiLCJSb3V0ZXMiLCJyZWR1Y2VyIiwiZ3JhcGhxbFNjaGVtYSIsImdyYXBocWxSb290IiwidXJsIiwicHJvbWlzZSIsInJlbmRlclJvdXRlIiwicmVuZGVyTGF5b3V0IiwiY29udGV4dCIsInJvdXRlciIsInJlbmRlclJlYWN0Q29tcG9uZW50cyIsInJlbmRlciIsInJlc2V0R2xvYmFscyIsInByb21pc2VzIiwibGVuZ3RoIiwiUHJvbWlzZSIsImFsbCIsInJlc2V0R2xvYmFsc0FnYWluIiwiZmluYWwiLCJib290c3RyYXAiLCJyb3V0ZXMiLCJsYXlvdXQiLCJyZWR1Y2VycyIsIm90aGVyIiwicmVhY3RSZWR1eE1pZGRsZXdhcmVJbml0IiwicmVzb2x2ZWRDb25maWciLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU1BLE9BQU8sVUFBYjtBQUNBLE1BQU0sRUFBRUMsY0FBRixLQUFxQkMsUUFBUyxHQUFFRixJQUFLLHNCQUFoQixDQUEzQjtBQUNBLE1BQU0sRUFBRUcsUUFBRixLQUFlRCxRQUFTLEdBQUVGLElBQUssY0FBaEIsQ0FBckI7QUFDQSxNQUFNSSx5QkFBeUJGLFFBQVMsR0FBRUYsSUFBSyxpQkFBaEIsQ0FBL0I7QUFDQSxNQUFNLEVBQUVLLFNBQVNDLGVBQVgsS0FBK0JKLFFBQVMsR0FBRUYsSUFBSyxpQkFBaEIsQ0FBckM7QUFDQSxNQUFNTyxpQkFBaUJMLFFBQVMsR0FBRUYsSUFBSyxpQkFBaEIsQ0FBdkI7QUFDQSxNQUFNUSxRQUFRTixRQUFRLE9BQVIsQ0FBZDtBQUNBLE1BQU0sRUFBRU8sV0FBRixFQUFlQyxlQUFmLEtBQW1DUixRQUFRLE9BQVIsQ0FBekM7QUFDQSxNQUFNLEVBQUVTLFFBQUYsS0FBZVQsUUFBUSxhQUFSLENBQXJCO0FBQ0EsTUFBTSxFQUFFVSxjQUFGLEVBQWtCQyxvQkFBbEIsS0FBMkNYLFFBQVEsa0JBQVIsQ0FBakQ7QUFDQSxNQUFNLEVBQUVZLFlBQUYsS0FBbUJaLFFBQVEsa0JBQVIsQ0FBekI7QUFDQSxNQUFNLEVBQUVhLE1BQUYsS0FBYWIsUUFBUyxHQUFFRixJQUFLLGVBQWhCLENBQW5CO0FBQ0EsTUFBTSxFQUFFZ0IsT0FBRixFQUFXQyxXQUFYLEtBQTJCZixRQUFRLFNBQVIsQ0FBakM7O0FBRUEsTUFBTWdCLGFBQWNDLE9BQUQsSUFBYTs7QUFFNUIsUUFBSUEsT0FBSixFQUFhO0FBQ1RDLGVBQU9DLFNBQVAsR0FBbUIsRUFBRUMsV0FBV0gsUUFBUUksT0FBUixDQUFnQixZQUFoQixDQUFiLEVBQW5CO0FBQ0g7O0FB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QUFWLENBQXZCO0FBQ0EsV0FDSSxPQUFPRixHQUFQLEVBQVlDLElBQVosS0FDSSxNQUFNRixxQkFBcUJDLEdBQXJCLEVBQTBCQyxJQUExQixFQUFnQytCLGNBQWhDLENBRmQ7QUFLSCxDQVBEOztBQVNBcEQsT0FBT3FELE9BQVAsR0FBaUJGLHdCQUFqQiIsImZpbGUiOiJ1bmtub3duIiwic291cmNlUm9vdCI6Im5vZGVfbW9kdWxlcy9ldGhpY2FsIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgcm9vdCA9ICcuLi8uLi8uLidcbmNvbnN0IHsgc2V0UHJvamVjdFJvb3QgfSA9IHJlcXVpcmUoYCR7cm9vdH0vaGVscGVyL3Jlc29sdmUtbm9kZWApXG5jb25zdCB7IGFic29sdXRlIH0gPSByZXF1aXJlKGAke3Jvb3R9L2hlbHBlci9wYXRoYClcbmNvbnN0IGNyZWF0ZVByb21pc2VDb2xsZWN0b3IgPSByZXF1aXJlKGAke3Jvb3R9L2hlbHBlci9jb2xsZWN0YClcbmNvbnN0IHsgZGVmYXVsdDogUHJvbWlzZVByb3ZpZGVyIH0gPSByZXF1aXJlKGAke3Jvb3R9L3JlYWN0L3Byb3ZpZGVyYClcbmNvbnN0IGdldEluaXRTY3JpcHRzID0gcmVxdWlyZShgJHtyb290fS9jbGllbnQvc2NyaXB0c2ApXG5jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbmNvbnN0IHsgY3JlYXRlU3RvcmUsIGNvbWJpbmVSZWR1Y2VycyB9ID0gcmVxdWlyZSgncmVkdXgnKVxuY29uc3QgeyBQcm92aWRlciB9ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKVxuY29uc3QgeyByZW5kZXJUb1N0cmluZywgcmVuZGVyVG9TdGF0aWNNYXJrdXAgfSA9IHJlcXVpcmUoJ3JlYWN0LWRvbS9zZXJ2ZXInKVxuY29uc3QgeyBTdGF0aWNSb3V0ZXIgfSA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1kb20nKVxuY29uc3QgeyBIZWxtZXQgfSA9IHJlcXVpcmUoYCR7cm9vdH0vcmVhY3QvaGVsbWV0YClcbmNvbnN0IHsgZ3JhcGhxbCwgYnVpbGRTY2hlbWEgfSA9IHJlcXVpcmUoJ2dyYXBocWwnKVxuXG5jb25zdCBzZXRHbG9iYWxzID0gKHJlcXVlc3QpID0+IHtcblxuICAgIGlmIChyZXF1ZXN0KSB7XG4gICAgICAgIGdsb2JhbC5uYXZpZ2F0b3IgPSB7IHVzZXJBZ2VudDogcmVxdWVzdC5oZWFkZXJzWyd1c2VyLWFnZW50J10gfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc2V0UHJvamVjdFJvb3QgPSBzZXRQcm9qZWN0Um9vdChtb2R1bGUucGFyZW50LnBhcmVudC5pZClcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJlc2V0UHJvamVjdFJvb3QoKVxuICAgICAgICBkZWxldGUgZ2xvYmFsLm5hdmlnYXRvclxuICAgIH1cbn1cblxuY29uc3QgcmVzb2x2ZUxheW91dFByb3BzID0gKGh0bWwsIHN0b3JlKSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IDxldGhpY2FsLXJvb3QgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9eyB7IF9faHRtbDogaHRtbCB9IH0gLz5cbiAgICBjb25zdCBzY3JpcHRzID0gZ2V0SW5pdFNjcmlwdHMoc3RvcmUuZ2V0U3RhdGUoKSlcbiAgICBjb25zdCBoZWxtZXQgPSBIZWxtZXQucmVuZGVyU3RhdGljKClcbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaHRtbDogaGVsbWV0Lmh0bWxBdHRyaWJ1dGVzLnRvQ29tcG9uZW50KCksXG4gICAgICAgIGJvZHk6IGhlbG1ldC5ib2R5QXR0cmlidXRlcy50b0NvbXBvbmVudCgpLFxuICAgICAgICB0aXRsZTogaGVsbWV0LnRpdGxlLnRvQ29tcG9uZW50KCksXG4gICAgICAgIG1ldGE6IGhlbG1ldC5tZXRhLnRvQ29tcG9uZW50KCksXG4gICAgICAgIGxpbms6IGhlbG1ldC5saW5rLnRvQ29tcG9uZW50KCksXG4gICAgICAgIHNjcmlwdHMsXG4gICAgICAgIHJvb3RcbiAgICB9XG4gICAgcmV0dXJuIHByb3BzXG59XG5cbmNvbnN0IHJlYWN0UmVkdXhNaWRkbGV3YXJlID0gYXN5bmMgKGN0eCwgbmV4dCwgY29uZmlnKSA9PiB7XG4gICAgY29uc3QgeyBtZXRob2QsIHJlcXVlc3QsIHJlc3BvbnNlIH0gPSBjdHhcbiAgICBjb25zdCB7IGJvZHkgfSA9IHJlc3BvbnNlXG4gICAgaWYgKGJvZHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gYXdhaXQgbmV4dCgpXG4gICAgfVxuXG4gICAgY29uc3QgeyAgTGF5b3V0LCBSb3V0ZXMsIHJlZHVjZXIsIGdyYXBocWxTY2hlbWEsIGdyYXBocWxSb290IH0gPSBjb25maWdcbiAgICBjb25zdCB7IHVybCB9ID0gcmVxdWVzdFxuXG4gICAgY29uc3QgcHJvbWlzZSA9IGNyZWF0ZVByb21pc2VDb2xsZWN0b3IoKVxuICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmUoY29tYmluZVJlZHVjZXJzKHJlZHVjZXIpKVxuICAgIGNvbnN0IHByb3BzID0gYXdhaXQgcmVuZGVyUm91dGUoeyB1cmwsIFJvdXRlcywgc3RvcmUsIHByb21pc2UsIHJlcXVlc3QgfSlcblxuICAgIHJlc3BvbnNlLmJvZHkgPSByZW5kZXJMYXlvdXQoTGF5b3V0LCBwcm9wcylcblxuICAgIGF3YWl0IG5leHQoKVxufVxuXG5jb25zdCByZW5kZXJSb3V0ZSA9IGFzeW5jIChjb250ZXh0KSA9PiB7XG4gICAgY29uc3Qgcm91dGVyID0ge31cbiAgICBjb25zdCBwcm9wcyA9IGF3YWl0IHJlbmRlclJlYWN0Q29tcG9uZW50cyh7IC4uLmNvbnRleHQsIHJvdXRlciB9KVxuICAgIGNvbnN0IHsgdXJsIH0gPSByb3V0ZXJcbiAgICBpZiAodXJsKSB7XG4gICAgICAgIHJldHVybiByZW5kZXJSb3V0ZSh7IC4uLmNvbnRleHQsIHVybCB9KVxuICAgIH1cbiAgICByZXR1cm4gcHJvcHNcbn1cblxuY29uc3QgcmVuZGVyUmVhY3RDb21wb25lbnRzID0gYXN5bmMgKGNvbnRleHQpID0+IHtcblxuICAgIGNvbnN0IHsgdXJsLCByb3V0ZXIsIFJvdXRlcywgc3RvcmUsIHByb21pc2UsIHJlcXVlc3QgfSA9IGNvbnRleHRcbiAgICBjb25zdCByZW5kZXIgPSAoKSA9PiByZW5kZXJUb1N0cmluZyhcbiAgICAgICAgPFByb21pc2VQcm92aWRlciBwcm9taXNlPXtwcm9taXNlfT5cbiAgICAgICAgICAgIDxQcm92aWRlciBzdG9yZT17c3RvcmV9PlxuICAgICAgICAgICAgICAgIDxTdGF0aWNSb3V0ZXIgY29udGV4dD17cm91dGVyfSBsb2NhdGlvbj17dXJsfT5cbiAgICAgICAgICAgICAgICAgICAge1JvdXRlc31cbiAgICAgICAgICAgICAgICA8L1N0YXRpY1JvdXRlcj5cbiAgICAgICAgICAgIDwvUHJvdmlkZXI+XG4gICAgICAgIDwvUHJvbWlzZVByb3ZpZGVyPlxuICAgIClcblxuICAgIGNvbnN0IHJlc2V0R2xvYmFscyA9IHNldEdsb2JhbHMocmVxdWVzdClcbiAgICBjb25zdCBodG1sID0gcmVuZGVyKClcbiAgICByZXNldEdsb2JhbHMoKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBwcm9taXNlKClcbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gcHJvbWlzZXNcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlTGF5b3V0UHJvcHMoaHRtbCwgc3RvcmUpXG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG5cbiAgICBjb25zdCByZXNldEdsb2JhbHNBZ2FpbiA9IHNldEdsb2JhbHMocmVxdWVzdClcbiAgICBjb25zdCBmaW5hbCA9IHJlbmRlcigpXG4gICAgcmVzZXRHbG9iYWxzQWdhaW4oKVxuXG4gICAgcmV0dXJuIHJlc29sdmVMYXlvdXRQcm9wcyhmaW5hbCwgc3RvcmUpXG59XG5cbmNvbnN0IHJlbmRlckxheW91dCA9IChMYXlvdXQsIHByb3BzKSA9PiByZW5kZXJUb1N0YXRpY01hcmt1cChcbiAgICA8TGF5b3V0IHsgLi4ueyAuLi5wcm9wc30gfSAvPlxuKVxuXG5jb25zdCBib290c3RyYXAgPSAoY29uZmlnKSA9PiB7XG5cbiAgICBjb25zdCByZXNldEdsb2JhbHMgPSBzZXRHbG9iYWxzKClcblxuICAgIGNvbnN0IHsgcm91dGVzLCBsYXlvdXQsIHJlZHVjZXJzLCAuLi5vdGhlciB9ID0gY29uZmlnXG5cbiAgICBjb25zdCB7IGRlZmF1bHQ6IExheW91dCB9ID0gcmVxdWlyZShhYnNvbHV0ZShsYXlvdXQpKVxuICAgIGNvbnN0IHsgZGVmYXVsdDogUm91dGVzIH0gPSByZXF1aXJlKGFic29sdXRlKHJvdXRlcykpXG4gICAgY29uc3QgeyBkZWZhdWx0OiByZWR1Y2VyIH0gPSByZXF1aXJlKGFic29sdXRlKHJlZHVjZXJzKSlcblxuICAgIHJlc2V0R2xvYmFscygpXG5cbiAgICByZXR1cm4geyBMYXlvdXQsIFJvdXRlcywgcmVkdWNlciwgLi4ub3RoZXIgfVxufVxuXG5jb25zdCByZWFjdFJlZHV4TWlkZGxld2FyZUluaXQgPSAoY29uZmlnKSA9PiB7XG4gICAgY29uc3QgcmVzb2x2ZWRDb25maWcgPSBib290c3RyYXAoY29uZmlnKVxuICAgIHJldHVybiAoXG4gICAgICAgIGFzeW5jIChjdHgsIG5leHQpID0+IChcbiAgICAgICAgICAgIGF3YWl0IHJlYWN0UmVkdXhNaWRkbGV3YXJlKGN0eCwgbmV4dCwgcmVzb2x2ZWRDb25maWcpXG4gICAgICAgIClcbiAgICApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhY3RSZWR1eE1pZGRsZXdhcmVJbml0XG4iXX0=