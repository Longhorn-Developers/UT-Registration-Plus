import { GOOGLE_CALENDAR_IMPORT_URL } from '@shared/util/appUrls';
import GoogleCalendarImportGuide from '@views/components/calendar/GoogleCalendarImportGuide';
import { saveAsCal } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import { useDialog } from '@views/contexts/DialogContext';
import ArrowSquareOutIcon from '~icons/ph/arrow-square-out';

/**
 * Adds the active schedule to Google Calendar the way Google allows without signing in to it: the schedule is saved
 * as a .ics file, and a dialog shows how to import it, with a button that opens Google Calendar's import settings.
 *
 * @returns A function that saves the .ics file and shows the dialog.
 */
export default function useGoogleCalendarImport(): () => Promise<void> {
    const showDialog = useDialog();

    return async () => {
        await saveAsCal();

        showDialog(close => ({
            className: 'w-[440px] max-w-full flex flex-col gap-spacing-5 p-6.25 border border-divider/50',
            title: (
                <Text variant='h2' as='h1' className='text-content'>
                    Add to Google Calendar
                </Text>
            ),
            description: <GoogleCalendarImportGuide onSaveAgain={() => void saveAsCal()} />,
            buttons: (
                <>
                    <Button variant='minimal' color='theme-black' className='!text-content' onClick={close}>
                        Close
                    </Button>
                    <Button
                        color='ut-burntorange'
                        icon={ArrowSquareOutIcon}
                        onClick={() => {
                            window.open(GOOGLE_CALENDAR_IMPORT_URL, '_blank', 'noopener');
                            close();
                        }}
                    >
                        Open Google Calendar
                    </Button>
                </>
            ),
        }));
    };
}
