import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.GITHUB_ACCESS_TOKEN) {
    throw new Error('GITHUB_ACCESS_TOKEN is not set');
}

const config: CodegenConfig = {
    schema: {
        'https://api.github.com/graphql': {
            headers: {
                'User-Agent': 'UT-Registration-Plus',
                Authorization: `bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            },
        },
    },
    documents: ['src/**/*.graphql'],
    generates: {
        './src/graphql/generated/': {
            preset: 'client',
            plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
            config: {
                withHooks: true,
                withComponent: false,
                withHOC: false,
            },
        },
    },
    hooks: { afterOneFileWrite: ['prettier --write'] },
};

export default config;
