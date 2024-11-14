/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    'query GetRepositoryStats($owner: String!, $name: String!) {\n  repository(owner: $owner, name: $name) {\n    defaultBranchRef {\n      target {\n        ... on Commit {\n          history(first: -1) {\n            totalCount\n            nodes {\n              author {\n                name\n                email\n                user {\n                  login\n                  avatarUrl\n                }\n              }\n              additions\n              deletions\n              committedDate\n            }\n          }\n        }\n      }\n    }\n    pullRequests(states: [MERGED], first: -1) {\n      totalCount\n      nodes {\n        author {\n          login\n        }\n      }\n    }\n  }\n}':
        types.GetRepositoryStatsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: 'query GetRepositoryStats($owner: String!, $name: String!) {\n  repository(owner: $owner, name: $name) {\n    defaultBranchRef {\n      target {\n        ... on Commit {\n          history(first: -1) {\n            totalCount\n            nodes {\n              author {\n                name\n                email\n                user {\n                  login\n                  avatarUrl\n                }\n              }\n              additions\n              deletions\n              committedDate\n            }\n          }\n        }\n      }\n    }\n    pullRequests(states: [MERGED], first: -1) {\n      totalCount\n      nodes {\n        author {\n          login\n        }\n      }\n    }\n  }\n}'
): (typeof documents)['query GetRepositoryStats($owner: String!, $name: String!) {\n  repository(owner: $owner, name: $name) {\n    defaultBranchRef {\n      target {\n        ... on Commit {\n          history(first: -1) {\n            totalCount\n            nodes {\n              author {\n                name\n                email\n                user {\n                  login\n                  avatarUrl\n                }\n              }\n              additions\n              deletions\n              committedDate\n            }\n          }\n        }\n      }\n    }\n    pullRequests(states: [MERGED], first: -1) {\n      totalCount\n      nodes {\n        author {\n          login\n        }\n      }\n    }\n  }\n}'];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
