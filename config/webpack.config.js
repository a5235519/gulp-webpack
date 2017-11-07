// 基本配置环境
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var SpritesmithPlugin = require('webpack-spritesmith')  // 雪碧图合并

module.exports = {
	// 入口
	entry: {
		main: path.resolve(__dirname, '../src/app.js')
	},

	// 输出
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'js/main.js'
	},

	// 方便引用vue
	resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },

	// 加载器
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader'
                    ]
                })
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						css: ExtractTextPlugin.extract({
							use: 'css-loader',
							fallback: 'style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
						}),
						sass: ExtractTextPlugin.extract({
							fallback: 'style-loader',
		                    use: [
		                        'css-loader',
		                        'sass-loader'
		                    ]
				 		}),
					}
				}
			},
			{
				test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015"
                        ]
                    }
                },
                exclude: path.resolve(__dirname, '../node_modules')
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'url-loader',
		        options: {
		            name: '[name]-[hash:6].[ext]',
		            outputPath: 'images/',
		            limit: 10000
		        }
			},
			{
			    test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
			    loader: 'url-loader',
		        options: {
		            name: '[name]-[hash:6].[ext]',
		            outputPath: 'fonts/',
		            limit: 10000
		        }
		    },
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
	        filename: 'index.html',
	        template: path.resolve(__dirname, '../index.html'),
	        inject: true
	    }),

	    new webpack.ProvidePlugin({
	        jQuery: "jquery",
	        $: "jquery"
	    }),

	    // 生成独立CSS文件
	    new ExtractTextPlugin("./css/[name].css"),

	    // 合并雪碧图
	    new SpritesmithPlugin({
	        // 目标小图标
	        src: {
	            cwd: path.resolve(__dirname, '../src/assets/images/icons'),
	            glob: '*.png'
	        },
	        // 输出雪碧图文件及样式文件
	        target: {
	            image: path.resolve(__dirname, '../src/assets/images/sprite.png'),
	            css: path.resolve(__dirname, '../src/assets/css/sprite/sprite.css')
	        },
	        // 样式文件中调用雪碧图地址写法
	        apiOptions: {
	            cssImageRef: '../../images/sprite.png'
	        },
	        spritesmithOptions: {
	            algorithm: 'top-down'
	        }
	    })
	]
}
