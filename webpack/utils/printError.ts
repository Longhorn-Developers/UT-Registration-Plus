import printBuildError from 'react-dev-utils/printBuildError';
import { error } from './chalk';
/**
 * Print Errors that we got back from webpack
 * @param e the error provided by webpacxk
 */
export default function printError(e: Error) {
    console.log('printBuildError -> e', e);
    if (process.env.TSC_COMPILE_ON_ERROR === 'true') {
        printBuildError(e);
    } else {
        // console.log(error('Failed to compile.\n'));
        printBuildError(e);
        process.exit(1);
    }
}
