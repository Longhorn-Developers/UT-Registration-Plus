/**
 * @fileoverview Check if imports match the path aliases defined in tsconfig.
 */

'use strict';

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Check if imports match the path aliases defined in tsconfig',
            category: 'Possible Errors',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },

    create: function (context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                // Get aliases from tsconfig and check if the import matches any of them
                // "paths": {
                //     "src/*": ["src/*"],
                //     "@assets/*": ["src/assets/*"],
                //     "@pages/*": ["src/pages/*"],
                //     "@public/*": ["public/*"],
                //     "@shared/*": ["src/shared/*"],
                //     "@background/*": ["src/pages/background/*"],
                //     "@views/*": ["src/views/*"]
                // }
                const tsconfig = require('../tsconfig.json');
                const paths = tsconfig.compilerOptions.paths;
                let pathList = [];

                for (let key in paths) {
                    paths[key].forEach(value => {
                        if (key.startsWith('@')) {
                            pathList.push(value.replace('/*', ''));
                        }
                    });
                }

                if (pathList.some(path => importPath.startsWith(path))) {
                    context.report({
                        node,
                        message: 'Use a path alias here',
                    });
                }
            },
        };
    },
};
