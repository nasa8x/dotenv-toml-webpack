# dotenv-toml-webpack

A secure webpack plugin that gives the ability to access environment variables via `process.env.*` defined in your `.env.toml`, `.env.development.toml`, `.env.production.toml`, etc,. files within your web applications built with webpack.


## Installation

Using NPM:

```sh
npm install dotenv-toml-webpack --save-dev
```

Using Yarn:

```sh
$ yarn add dotenv-toml-webpack --dev
```

## Description

`dotenv-toml-webpack` wraps `toml` and `Webpack.DefinePlugin`. As such, it does a text replace in the resulting bundle for any instances of `process.env`.

Your `.env` files can include sensitive information. Because of this,`dotenv-toml-webpack` will only expose environment variables that are **explicitly referenced in your code** to your final bundle.


## Usage example

Let's suppose you have the following files in your project:

```sh
# .env.toml

API_URL = "http://localhost:8081"
BASE_URL = "http://localhost:8080"

[DB]
HOST = "127.0.0.1"
NAME = "mydb"
PASS = "1qa2ws3ed4rf5tg6yh"
PORT = 27017
USER = "sa"

```

```js
// webpack.config.js

const EnvTomlPlugin = require('dotenv-toml-webpack');
// or
// const { EnvTomlPlugin } = require('dotenv-toml-webpack');

module.exports = {
  // ...
  plugins: [
    new EnvTomlPlugin()
  ],
  // ...
};
```
### Use in your code

```js
// file1.js
console.log(process.env.BASE_URL);
// 'http://localhost:8080'

console.log(process.env.DB.HOST);
// '127.0.0.1'

```
### Resulting bundle
```js
// bundle.js
console.log('http://localhost:8080');
console.log('127.0.0.1');
```

Note: the `.env.*.toml` values for `BASE_URL` and `DB` are NOT present in our bundle, as they were never referenced (as process.env.[VAR_NAME]) in the code.

## How Secure?
By allowing you to define exactly where you are loading environment variables from and bundling only variables in your project that are explicitly referenced in your code, you can be sure that only what you need is included and you do not accidentally leak anything sensitive.

### Recommended
Add `.env.*` to your `.gitignore` file

## Env Webpack Mode

```sh
# .env.development.toml

API_URL = "http://localhost:8081"
BASE_URL = "http://localhost:8080"

[DB]
HOST = "127.0.0.1"
NAME = "mydb"
PASS = "123456"
PORT = 27017
USER = "sa"

```

```sh
# .env.production.toml

API_URL = "https://api.yourdomain.com"
BASE_URL = "https://yourdomain.com"

[DB]
HOST = "127.0.0.1"
NAME = "mydb"
PASS = "123456"
PORT = 27017
USER = "sa"
```

```js
// webpack.config.js
module.exports = (env, argv) => {

    console.log(argv, env);
    const prod = argv.mode === 'production';    

    return {
        mode: 'development',
        target: 'web',
        devtool: prod ? false : 'source-map',
        plugins: [
            new EnvTomlPlugin({
                 path: `./.env.${argv.mode}.toml`,
            }),

        ],

    };
};
```
## Properties

Use the following properties to configure your instance.

* **path** (`'./.env.toml'`) - The path to your environment variables.
* **systemvars** (`false`) - Set to true if you would rather load all system variables as well (useful for CI purposes).
* **silent** (`false`) - If true, all warnings will be suppressed.
* **safe** (`false`) - If true, load '.env.example.toml' to verify the '.env' variables are all set. Can also be a string to a different file.

The following example shows how to set any/all arguments.

```javascript
module.exports = {
  ...
  plugins: [
    new Dotenv({
      path: './.env.other.toml', // load this now instead of the ones in '.env'      
      systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
      silent: true, // hide any errors
      safe: true, // load '.env.example.toml' to verify the '.env' variables are all set. Can also be a string to a different file.
    })
  ]
  ...
};
```


Contributing
------------

Please refer to each project's style and contribution guidelines for submitting patches and additions. In general, we follow the "fork-and-pull" Git workflow.

 1. **Fork** the repo on GitHub
 2. **Clone** the project to your own machine
 3. **Commit** changes to your own branch
 4. **Push** your work back up to your fork
 5. Submit a **Pull request** so that we can review your changes

NOTE: Be sure to merge the latest from "upstream" before making a pull request!

Community
------------
Stay up to date on the development of Morioh UI and reach out to the community with these helpful resources.

Follow [@codek_tv](https://twitter.com/codek_tv) and [@im_a_developer](https://twitter.com/im_a_developer) on Twitter.

Follow [Morioh](https://www.facebook.com/moriohdotcom) and [Vue Developers](https://www.facebook.com/VueDevelopers) on FaceBook.

Join the official [Discord](https://discord.gg/sqxU6un) room: [https://discord.gg/sqxU6un](https://discord.gg/sqxU6un).


## License

Licensed under [MIT](LICENSE) (c) 2021 [Morioh Team](https://morioh.com)