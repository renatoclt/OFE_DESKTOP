const fs = require('fs');
const path = require('path');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { GlobCopyWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AotPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const entryPoints = ["inline","polyfills","sw-register","scripts","vendor","main"];
const minimizeCss = false;
const baseHref = "";
const deployUrl = "";

const prod = process.argv.indexOf('-p') !== -1;
var baseUrl = '<base href="/" id="baseurl">';

const config = {
  entry: path.resolve(__dirname,'src','main.js'),
  output: {
    path: 'build',
    filename: 'bundle.js'
  }
};

config.plugins = config.plugins||[];
if (prod) {
  baseUrl = '<base href="/ui/" id="baseurl">';
}

const postcssPlugins = function () {
        // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
        const importantCommentRe = /@preserve|@license|[@#]\s*source(?:Mapping)?URL|^!/i;
        const minimizeOptions = {
            autoprefixer: false,
            safe: true,
            mergeLonghand: false,
            discardComments: { remove: (comment) => !importantCommentRe.test(comment) }
        };
        return [
            postcssUrl({
                url: (URL) => {
                    // Only convert root relative URLs, which CSS-Loader won't process into require().
                    if (!URL.startsWith('/') || URL.startsWith('//')) {
                        return URL;
                    }
                    if (deployUrl.match(/:\/\//)) {
                        // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                        return `${deployUrl.replace(/\/$/, '')}${URL}`;
                    }
                    else if (baseHref.match(/:\/\//)) {
                        // If baseHref contains a scheme, include it as is.
                        return baseHref.replace(/\/$/, '') +
                            `/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                    else {
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                    }
                }
            }),
            autoprefixer(),
        ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
    };

var CompressionPlugin = require("compression-webpack-plugin");


module.exports = {
  "resolve": {
    "extensions": [
      ".ts",
      ".js",
      ".jsx"
    ],
    "modules": [
      "./node_modules",
      "./node_modules"
    ],
    "symlinks": true
  },
  "resolveLoader": {
    "modules": [
      "./node_modules",
      "./node_modules"
    ]
  },
  "entry": {
    "main": [
	  path.resolve(__dirname,'src','main.ts')
    ],
    "polyfills": [
	  path.resolve(__dirname,'src','polyfills.ts')
    ],
    "scripts": [
      /*"script-loader!./node_modules\\core-js\\client\\shim.min.js",
      "script-loader!./node_modules\\zone.js\\dist\\zone.js",
      "script-loader!./node_modules\\reflect-metadata\\Reflect.js",
      "script-loader!./node_modules\\systemjs\\dist\\system.src.js",*/

      "script-loader!"+path.resolve(__dirname,'node_modules','jquery','dist','jquery.js'),
      "script-loader!"+path.resolve(__dirname,'node_modules','jquery-ui-dist','jquery-ui.min.js'),
      "script-loader!"+path.resolve(__dirname,'node_modules','bootstrap','dist','js','bootstrap.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','core','material.min.js'),
      "script-loader!"+path.resolve(__dirname,'node_modules','arrive','src','arrive.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','moment','min','moment-with-locales.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','chartist','dist','chartist.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','twitter-bootstrap-wizard','jquery.bootstrap.wizard.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','bootstrap-notify','bootstrap-notify.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','eonasdan-bootstrap-datetimepicker','src','js','bootstrap-datetimepicker.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','nouislider','distribute','nouislider.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','bootstrap-select','dist','js','bootstrap-select.js'),	 
      "script-loader!"+path.resolve(__dirname,'node_modules','datatables.net','js','jquery.dataTables.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','datatables.net-bs','js','dataTables.bootstrap.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','datatables.net-responsive','js','dataTables.responsive.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','fullcalendar','dist','fullcalendar.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','bootstrap-tagsinput','dist','bootstrap-tagsinput.js'),	  
      "script-loader!"+path.resolve(__dirname,'node_modules','jasny-bootstrap','dist','js','jasny-bootstrap.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','core','jquery.perfect-scrollbar.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','jquery-jvectormap.js'),
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','sweetalert2.min.js'),
      "script-loader!"+path.resolve(__dirname,'src','assets','js','core','jquery.validate.min.js'),
      "script-loader!"+path.resolve(__dirname,'node_modules','moment','min','moment.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','moment','moment-with-locale-es.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','datatables.defaults.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','crypto-js.min.js'),	  
      "script-loader!"+path.resolve(__dirname,'src','assets','js','plugins','FileSaver.min.js'),

    ]
  },
  
  "output": {
    "path": path.join(process.cwd(), "dist"),
    "filename": "[name].bundle.js",
    "chunkFilename": "[id].chunk.js"
  },
  "module": {
    "rules": [
      {
        "enforce": "pre",
        "test": /\.js$/,
        "loader": "source-map-loader",
        "exclude": [
           path.join(process.cwd(), 'node_modules')
           // /\/node_modules\//
        ]
      },
      {
        "test": /\.json$/,
        "loader": "json-loader"
      },
      {
        "test": /\.html$/,
        "loader": "raw-loader"
      },
      {
        "test": /\.(eot|svg)$/,
        "loader": "file-loader?name=[name].[hash:20].[ext]"
      },
      {
        "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|cur|ani)$/,
        "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
      },
      {
        "exclude": [],
        "test": /\.css$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          }
        ]
      },
      {
        "exclude": [],
        "test": /\.scss$|\.sass$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "sass-loader",
            "options": {
              "sourceMap": false,
              "precision": 8,
              "includePaths": []
            }
          }
        ]
      },
      {
        "exclude": [],
        "test": /\.less$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "less-loader",
            "options": {
              "sourceMap": false
            }
          }
        ]
      },
      {
        "exclude": [],
        "test": /\.styl$/,
        "use": [
          "exports-loader?module.exports.toString()",
          {
            "loader": "css-loader",
            "options": {
              "sourceMap": false,
              "importLoaders": 1
            }
          },
          {
            "loader": "postcss-loader",
            "options": {
              "ident": "postcss",
              "plugins": postcssPlugins
            }
          },
          {
            "loader": "stylus-loader",
            "options": {
              "sourceMap": false,
              "paths": []
            }
          }
        ]
      },
      {
        "test": /\.ts$/,
        "loader": "@ngtools/webpack"
      }
    ]
  },
  "plugins": [
    new NoEmitOnErrorsPlugin(),
    new GlobCopyWebpackPlugin({
      "patterns": [
        "assets",
        "favicon.ico"
      ],
      "globOptions": {
        "cwd": path.join(process.cwd(), "src"),
        "dot": true,
        "ignore": "**/.gitkeep"
      }
    }),
    new ProgressPlugin(),
    new SourceMapDevToolPlugin({
      "filename": "[file].map[query]",
      "moduleFilenameTemplate": "[resource-path]",
      "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
      "sourceRoot": "webpack:///"
    }),
    new HtmlWebpackPlugin({
      "template": path.resolve(__dirname,'src','index.ejs'),
      "filename": "./index.html",
      "hash": false,
      "inject": true,
      "compile": true,
      "favicon": false,
      "minify": false,
      "cache": true,
      "showErrors": true,
      "chunks": "all",
      "excludeChunks": [],
      "title": "Webpack App",
      "baseurl": baseUrl,      
      "xhtml": true,
      "chunksSortMode": function sort(left, right) {
        let leftIndex = entryPoints.indexOf(left.names[0]);
        let rightindex = entryPoints.indexOf(right.names[0]);
        if (leftIndex > rightindex) {
            return 1;
        }
        else if (leftIndex < rightindex) {
            return -1;
        }
        else {
            return 0;
        }
    }
    }),
    new BaseHrefWebpackPlugin({}),
    new CommonsChunkPlugin({
      "minChunks": 2,
      "async": "common"
    }),
    new CommonsChunkPlugin({
      "name": [
        "inline"
      ],
      "minChunks": null
    }),
    new CommonsChunkPlugin({
      "name": [
        "vendor"
      ],
      "minChunks": (module) => {
                return module.resource
                    && (module.resource.startsWith(nodeModules)
                        || module.resource.startsWith(genDirNodeModules)
                        || module.resource.startsWith(realNodeModules));
            },
      "chunks": [
        "main"
      ]
    }),
    new NamedModulesPlugin({}),
    new AotPlugin({
      "mainPath": "main.ts",
      "hostReplacementPaths": {
	      "environments\\environment.ts": path.join('environments','environment.ts'),
        "environments/environment.ts": path.join('environments','environment.ts')
      },
      "exclude": [],
      "tsConfigPath": path.join('src','tsconfig.app.json'),
      "skipCodeGeneration": true
    }),
    new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		})
  ],
  "node": {
    "fs": "empty",
    "global": true,
    "crypto": "empty",
    "tls": "empty",
    "net": "empty",
    "process": true,
    "module": false,
    "clearImmediate": false,
    "setImmediate": false
  },
  "devServer": {
    "historyApiFallback": true
  }
};