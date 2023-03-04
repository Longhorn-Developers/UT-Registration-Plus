import React, { useEffect, useMemo } from 'react';
import { bMessenger } from 'src/shared/messages';
import { SiteSupport } from '../lib/getSiteSupport';
import { Button } from './common/Button/Button';

interface Props {
    support: SiteSupport[];
}

export default function CourseCatalogMain(props: Props) {
    const openGoogle = () => {
        bMessenger.openNewTab({ url: 'https://google.com' });
    };

    return <Button onClick={openGoogle}>{props.support.join(',')}</Button>;
}
