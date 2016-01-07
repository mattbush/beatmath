module.exports = {
    entry: {
        anagrams: "./js/anagrams",
        bricks: "./js/bricks",
        honeycomb: "./js/honeycomb",
        lattice: "./js/lattice",
        text: "./js/text",
        twenty_sixteen: "./js/twenty_sixteen",
        mixboard_and_hue: "./js/mixboard_and_hue",
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
                loader: 'babel', // 'babel-loader' is also a legal name to reference
            },
        ],
    }
};
