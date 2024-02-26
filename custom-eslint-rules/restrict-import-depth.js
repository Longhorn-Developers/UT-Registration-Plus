/**
 * @fileoverview Custom ESLint rule to restrict imports from accessing files more than 2 directories up.
 */

'use strict';

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Restrict imports from accessing files more than 2 directories up.',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },

    create: function (context) {
        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                if (importPath.startsWith('../')) {
                    const depth = importPath.match(/\.\.\//g).length;
                    if (depth > 2) {
                        context.report({
                            node,
                            message: 'Importing files more than 2 directories up is not allowed.',
                        });
                    }
                }
            },
        };
    },
};
