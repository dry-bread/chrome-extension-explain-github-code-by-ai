module.exports = {
    entry: './src/index.tsx',  // 入口文件
    output: {
        filename: 'content.bundle.js',
        path: __dirname + '/dist',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test:/\.tsx?$/,  // 处理 .ts 和 .tsx 文件
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],  // 支持 .ts, .tsx, .js 文件的导入
    }
};
