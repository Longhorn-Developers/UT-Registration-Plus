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
                if (importPath.startsWith('../../')) {
                    context.report({
                        node,
                        message: 'Importing files more than 2 directories up is not allowed.',
                    });
                }
            },
        };
    },
};
