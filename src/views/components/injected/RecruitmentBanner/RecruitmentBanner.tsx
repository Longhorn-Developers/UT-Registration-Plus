import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './RecruitmentBanner.module.scss';

const DISCORD_URL = 'https://discord.gg/qjcvgyVJbT';
const GITHUB_URL = 'https://github.com/sghsri/UT-Registration-Plus';

const RECRUIT_FROM_DEPARTMENTS = ['C S', 'ECE', 'MIS', 'CSE', 'EE', 'ITD'];

/**
 * This adds a new column to the course catalog table header.
 * @returns a react portal to the new column or null if the column has not been created yet.
 */
export default function RecruitmentBanner(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!canRecruitFrom()) {
            return;
        }
        const container = document.createElement('div');
        container.setAttribute('id', 'ut-registration-plus-table-head');

        const table = document.querySelector('table');
        table!.before(container);
        setContainer(container);
    }, []);

    if (!container) {
        return null;
    }

    return createPortal(
        <div className={styles.container}>
            <Text color='white'>
                Interested in helping us develop UT Registration Plus? Check out our{' '}
                <Link color='white' href={DISCORD_URL}>
                    Discord Server
                </Link>{' '}
                and{' '}
                <Link color='white' href={GITHUB_URL}>
                    GitHub
                </Link>
                !
            </Text>
        </div>,
        container
    );
}

/**
 * Determines if recruitment can be done from the current department.
 * @returns {boolean} True if recruitment can be done from the current department, false otherwise.
 */
export const canRecruitFrom = (): boolean => {
    const params = ['fos_fl', 'fos_cn'];
    let department = '';
    params.forEach(p => {
        const param = new URLSearchParams(window.location.search).get(p);
        if (param) {
            department = param;
        }
    });
    if (!department) {
        return false;
    }
    return RECRUIT_FROM_DEPARTMENTS.includes(department);
};
