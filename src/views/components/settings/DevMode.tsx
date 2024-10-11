import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Link from '@views/components/common/Link';
import React from 'react';

/**
 * Renders the DevMode component.
 *
 * @returns The rendered DevMode component.
 */
export default function DevMode() {
    return (
        <ExtensionRoot>
            <div className='text-base'>
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
        </ExtensionRoot>
    );
}
