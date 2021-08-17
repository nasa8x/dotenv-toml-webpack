const { DefinePlugin } = require('webpack');
const { readFileSync } = require('fs');
const { parse } = require('toml');

class EnvTomlPlugin {
    /**
     * The dotenv-toml-webpack plugin.
     * @param {Object} options - The parameters.
     * @param {String} [options.path=./.env.toml] - The location of the environment variable.     
     * @param {Boolean} [options.systemvars=false] - If true, load system environment variables.
     * @param {Boolean} [options.silent=false] - If true, suppress warnings, if false, display warnings.
     * @param {Boolean|String} [options.safe=false] - If false ignore safe-mode, if true load `'./.env.example.toml'`, if a string load that file as the sample.     
     * @returns {webpack.DefinePlugin}
     */
    constructor(options = {}) {
        this.config = Object.assign({}, {
            path: './.env.toml',
            encoding: 'utf8'
        }, options)
    }

    apply(compiler) {

        const { path, encoding, systemvars, silent, safe } = this.config;
        const data = this.read(path, encoding);
        const variables = parse(data);

        if (systemvars) {
            if (silent) {
                Object.assign(variables, process.env);
            }
            else {
                Object.keys(process.env).forEach((key) => {
                    if (variables.hasOwnProperty(key)) {
                        console.warn('dotenv-toml-webpack: "%s" is overwritten by the system environment variable with the same name', key);
                    }

                    variables[key] = process.env[key];
                });
            }
        }

        if (safe) {
            const example = typeof safe === 'string' ? safe : './.env.example.toml';
            const blueprint = parse(this.read(example, encoding));
            Object.keys(blueprint).forEach(key => {
                const value = variables[key];

                if (typeof value === 'undefined' || value === null || value === '') {
                    throw new Error(`Missing environment variable: ${key}`)
                }
            })
        }

        const definitions = {};
        Object.keys(variables).forEach((key) => {
            definitions[`process.env.${key}`] = JSON.stringify(variables[key]);
        });

        new DefinePlugin(definitions).apply(compiler);
    }

    read(file, encoding) {
        try {
            return readFileSync(file, encoding);
        } catch (err) {
            console.warn(`Failed to load ${file}.`);
            return '';
        }
    }

}


module.exports = EnvTomlPlugin;
module.exports.EnvTomlPlugin = EnvTomlPlugin;