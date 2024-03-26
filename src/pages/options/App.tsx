import { Fragment } from 'react';
import React from 'react';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Link from '@views/components/common/Link';
import Options from 'src/views/components/options/Options';

export default function App() {
    return (
        <Fragment>
            <ExtensionRoot className='h-full w-full'>
                <Options />
            </ExtensionRoot>
            <div className='text-base fixed bottom-0 w-full'>
                <div className='font-serif'>
                    <i>&ldquo;Real powerusers modify the sourcecode instead of using settings&rdquo;</i> - doprz
                </div>
                <div className='font-serif'>
                    <i>
                        &ldquo;become hackerman, go to{' '}
                        <Link
                            href='https://github.com/Longhorn-Developers/UT-Registration-Plus'
                            className='link font-serif! italic!'
                        >
                            github
                        </Link>{' '}
                        yay&rdquo;
                    </i>{' '}
                    - razboy20
                </div>
                <p className='mt-2.5 text-sm text-ut-gray'>
                    {import.meta.env.VITE_PACKAGE_VERSION} - {import.meta.env.MODE}{' '}
                    {import.meta.env.VITE_BETA_BUILD ? 'beta' : ''}
                </p>
            </div>
        </Fragment>
    );
}
