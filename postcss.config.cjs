/* eslint-disable global-require */
/** @type {import('postcss-load-config').Config} */
const config = {
    plugins:
        process.env.NODE_ENV !== 'development'
            ? [
                  require('cssnano')({
                      preset: 'advanced',
                  }),
              ]
            : [],
};

module.exports = config;
