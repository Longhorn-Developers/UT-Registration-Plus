import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './RecruitmentBanner.module.scss';

const DISCORD_URL = 'https://discord.gg/7pQDBGdmb7';
const GITHUB_URL = 'https://github.com/Longhorn-Developers/UT-Registration-Plus';
const DESIGNER_APPLICATION_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSdX1Bb37tW6s1bkdIW3GJoTGcM_Uc-2DzFOFMXxGdn1jZ3K1A/viewform';

// The lists below _must_ be mutually exclusive
const DEVELOPER_RECRUIT_FROM_DEPARTMENTS = new Set(['C S', 'ECE', 'MIS', 'CSE', 'EE', 'ITD']);
const DESIGNER_RECRUIT_FROM_DEPARTMENTS = new Set(['I', 'DES', 'AET']);

type RecruitmentType = 'DEVELOPER' | 'DESIGNER' | 'NONE';

const DeveloperRecruitmentBanner = () => (
    <div className={styles.container}>
        <Text className='text-white'>
            Interested in helping us develop UT Registration Plus? Check out our{' '}
            <Link className='text-ut-orange!' href={DISCORD_URL}>
                Discord Server
            </Link>{' '}
            and{' '}
            <Link className='text-ut-orange!' href={GITHUB_URL}>
                GitHub
            </Link>
            !
        </Text>
    </div>
);

const DesignerRecruitmentBanner = () => (
    <div className={styles.container}>
        <Text className='text-white'>
            Design for thousands of UT students through Longhorn Developers on real-world projects like UT Reg.
            Plus.—build your portfolio and collaborate in Figma. Apply{' '}
            <Link className='text-ut-orange!' href={DESIGNER_APPLICATION_URL}>
                here
            </Link>
            !
        </Text>
    </div>
);

/**
 * This adds a new column to the course catalog table header.
 *
 * @returns a react portal to the new column or null if the column has not been created yet.
 */
export default function RecruitmentBanner(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const recruitmentType = useMemo<RecruitmentType>(getRecruitmentType, []);

    useEffect(() => {
        if (recruitmentType === 'NONE') {
            return;
        }

        const container = document.createElement('div');
        container.setAttribute('id', 'ut-registration-plus-table-head');

        const table = document.querySelector('table');
        table!.before(container);
        setContainer(container);
    }, [recruitmentType]);

    if (!container || recruitmentType === 'NONE') {
        return null;
    }

    return createPortal(
        recruitmentType === 'DEVELOPER' ? <DeveloperRecruitmentBanner /> : <DesignerRecruitmentBanner />,
        container
    );
}

/**
 * Determines what type of recruitment can be done from the current department.
 *
 * @returns 'DEVELOPER' or 'DESIGNER' if the current department recruits for that respective type, otherwise 'NONE'
 */
export const getRecruitmentType = (): RecruitmentType => {
    const params = ['fos_fl', 'fos_cn'];
    let department = '';
    params.forEach(p => {
        const param = new URLSearchParams(window.location.search).get(p);
        if (param) {
            department = param;
        }
    });

    if (!department) {
        return 'NONE';
    }

    if (DEVELOPER_RECRUIT_FROM_DEPARTMENTS.has(department)) {
        return 'DEVELOPER';
    }

    if (DESIGNER_RECRUIT_FROM_DEPARTMENTS.has(department)) {
        return 'DESIGNER';
    }

    return 'NONE';
};
