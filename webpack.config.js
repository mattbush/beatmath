module.exports = {
    entry: {
        colors: "./js/colors",
        text: "./js/text",
        transition: "./js/transition",
    },
    output: {
        path: __dirname,
        filename: "js/build/[name].bundle.js",
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel' // 'babel-loader' is also a legal name to reference
            },
        ]
    }
};
