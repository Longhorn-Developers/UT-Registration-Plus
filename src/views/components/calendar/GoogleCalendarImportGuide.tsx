import { OptionsStore } from '@shared/storage/OptionsStore';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import type { JSX } from 'react';
import CaretDownIcon from '~icons/ph/caret-down';
import CheckCircleFillIcon from '~icons/ph/check-circle-fill';
import FileIcon from '~icons/ph/file';
import HandPointingFillIcon from '~icons/ph/hand-pointing-fill';
import UploadSimpleIcon from '~icons/ph/upload-simple';

import styles from './GoogleCalendarImportGuide.module.scss';

/**
 * Props for the GoogleCalendarImportGuide component
 */
export interface GoogleCalendarImportGuideProps {
    /** Saves the schedule as a .ics file again, in case the first download was missed */
    onSaveAgain: () => void;
}

/**
 * How to add the schedule's .ics file to Google Calendar, which can only be done from its import settings: a looping
 * drawing of the steps on Google's page, then the same steps written out.
 */
export default function GoogleCalendarImportGuide({ onSaveAgain }: GoogleCalendarImportGuideProps): JSX.Element {
    const reducedMotion = OptionsStore.useStore(store => store.enableReducedMotion);

    return (
        <div className='flex flex-col gap-spacing-5'>
            <ImportDemo isStill={reducedMotion} />
            <ol className='m-0 flex list-decimal flex-col gap-spacing-3 pl-5 text-content'>
                <Text as='li' variant='p'>
                    Your schedule was saved as <b>schedule.ics</b>.{' '}
                    <button
                        type='button'
                        className='cursor-pointer border-none bg-transparent p-0 link'
                        onClick={onSaveAgain}
                    >
                        Save it again
                    </button>
                </Text>
                <Text as='li' variant='p'>
                    In Google Calendar&apos;s import settings, click <b>Select file from your computer</b> and pick
                    schedule.ics.
                </Text>
                <Text as='li' variant='p'>
                    Choose the calendar to add your classes to, then click <b>Import</b>.
                </Text>
            </ol>
            <Text as='p' variant='small' className='text-content-muted'>
                This adds a copy of your classes, so later changes to your schedule won&apos;t show up in Google
                Calendar, and importing again adds every class a second time. Importing into a new calendar makes it
                easy to start over: delete that calendar, then import again.
            </Text>
        </div>
    );
}

// Google's blue, so the drawing looks like the page it's opening
const GOOGLE_BLUE = 'bg-[#1a73e8]';

/**
 * A drawing of Google Calendar's import settings. The pointer clicks "Select file from your computer", picks
 * schedule.ics, and clicks Import, over and over (see the stylesheet for the timeline). Hidden from screen readers,
 * since the steps are written out after it.
 */
function ImportDemo({ isStill }: { isStill: boolean }): JSX.Element {
    return (
        <div
            aria-hidden
            className={clsx(
                styles.demo,
                isStill && styles.still,
                'relative mx-auto h-[170px] w-[360px] max-w-full select-none overflow-hidden rounded border border-divider bg-surface text-content'
            )}
        >
            <span className='absolute left-4 top-3 text-sm font-medium'>Import</span>
            <span
                className={clsx(
                    styles.selectButton,
                    'absolute left-4 top-10 h-7 w-[210px] flex items-center gap-1.5 border border-divider rounded px-2 text-xs text-[#1a73e8]'
                )}
            >
                <UploadSimpleIcon className='h-3.5 w-3.5' />
                Select file from your computer
            </span>
            <span className={clsx(styles.fileName, 'absolute left-[236px] top-[47px] text-xs')}>schedule.ics</span>
            <span className='absolute left-4 top-[82px] h-7 w-[210px] flex items-center justify-between border border-divider rounded px-2 text-xs text-content-muted'>
                Add to calendar
                <CaretDownIcon className='h-3 w-3' />
            </span>
            <span
                className={clsx(
                    styles.importButton,
                    GOOGLE_BLUE,
                    'absolute left-4 top-[122px] h-[30px] w-[76px] flex items-center justify-center rounded text-xs font-medium text-white'
                )}
            >
                Import
            </span>
            <span
                className={clsx(
                    styles.done,
                    'absolute left-[104px] top-[128px] flex items-center gap-1 text-xs text-content-muted'
                )}
            >
                <CheckCircleFillIcon className='h-3.5 w-3.5 text-ut-green' />
                Imported your classes
            </span>

            {/* The file picker that "Select file from your computer" opens */}
            <span
                className={clsx(
                    styles.picker,
                    'absolute left-[150px] top-[22px] w-[196px] flex flex-col origin-top-left overflow-hidden border border-divider rounded bg-surface-raised text-xs shadow-lg'
                )}
            >
                <span className='border-b border-divider px-2 py-1.5 text-content-muted'>Downloads</span>
                <span className={clsx(styles.fileRow, 'flex items-center gap-1.5 px-2 py-1.5')}>
                    <FileIcon className='h-3.5 w-3.5' />
                    schedule.ics
                </span>
                <span className='flex items-center gap-1.5 px-2 py-1.5 text-content-muted'>
                    <FileIcon className='h-3.5 w-3.5' />
                    notes.txt
                </span>
            </span>

            <HandPointingFillIcon
                className={clsx(
                    styles.pointer,
                    'absolute left-0 top-0 h-[22px] w-[22px] origin-top-left text-content drop-shadow'
                )}
            />
        </div>
    );
}
