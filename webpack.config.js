module.exports = {
    entry: {
        anagrams: './js/anagrams/anagrams',
        bricks: './js/bricks/bricks',
        fronds: './js/fronds/fronds',
        honeycomb: './js/honeycomb/honeycomb',
        jestworld: './js/jestworld/jestworld',
        kale: './js/kale/kale',
        lattice: './js/lattice/lattice',
        nodes: './js/nodes/nodes',
        pinecone: './js/pinecone/pinecone',
        snowstorm: './js/snowstorm/snowstorm',
        text: './js/text/text',
        trees: './js/trees/trees',
        twenty_sixteen: './js/twenty_sixteen/twenty_sixteen',
        mapper: './js/mapper/mapper',
        mixboard_and_hue: './js/mixboard_and_hue/mixboard_and_hue',
        monitor: './js/core/outputs/monitor',
        wall_lattice: './js/wall_lattice/wall_lattice',
        wall_snowstorm: './js/wall_snowstorm/wall_snowstorm',
        wall_trees: './js/wall_trees/wall_trees',
        wallow: './js/wallow/wallow',
    },
    output: {
        path: __dirname,
        filename: 'js/build/[name].bundle.js',
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'},
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
    },
};
