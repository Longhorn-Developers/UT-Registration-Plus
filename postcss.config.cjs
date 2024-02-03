/* eslint-disable global-require */
/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        cssnano: process.env.NODE_ENV !== 'development' ? {} : false,
        // '@unocss/postcss': {},
    },
};

module.exports = config;
