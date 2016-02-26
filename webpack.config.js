module.exports = {
    entry: {
        anagrams: "./js/anagrams/anagrams",
        bricks: "./js/bricks/bricks",
        honeycomb: "./js/honeycomb/honeycomb",
        lattice: "./js/lattice/lattice",
        pinecone: "./js/pinecone/pinecone",
        text: "./js/text/text",
        trees: "./js/trees/trees",
        twenty_sixteen: "./js/twenty_sixteen/twenty_sixteen",
        mixboard_and_hue: "./js/mixboard_and_hue/mixboard_and_hue",
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
    },
    resolve: {
        root: [
            __dirname,
        ],
    }
};
