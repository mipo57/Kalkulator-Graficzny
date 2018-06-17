const path = require('path');

const renderer = {
    entry: path.join(__dirname, 'src/renderer.tsx'),
    output: {
        filename: 'dist/app.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader?url=false'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    target: "electron-renderer",
    externals: (ctx, req, done) => (/^node-pty$/.test(req) ? done(null, `commonjs ${req}`) : done()),
    //devtool: "inline-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".scss"]
    }
};

const app = {
    entry: path.join(__dirname, 'src/main.ts'),
    output: {
        filename: 'dist/main.js',
        path: __dirname
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader?url=false'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
                exclude: /node_modules/,
            },
        ],
    },
    target: "electron-main",
    //devtool: "inline-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".scss"]
    }
};

module.exports = [app, renderer];