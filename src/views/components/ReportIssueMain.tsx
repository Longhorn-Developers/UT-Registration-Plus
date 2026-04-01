import 'uno.css';

import { captureFeedback } from '@sentry/react';
import type { JSX } from 'react';
import { useState } from 'react';
import XIcon from '~icons/ph/x';

import { Button } from './common/Button';
import Input from './common/Input';
import Text from './common/Text/Text';

interface Props {
    onClose?: () => void;
}

/**
 * ReportIssueMain component renders a feedback form for users to submit their email and feedback.
 *
 * @returns The rendered component.
 */
export default function ReportIssueMain({ onClose }: Props): JSX.Element {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleClose = () => {
        if (onClose) {
            onClose();
            return;
        }

        window.close();
    };

    const submitFeedback = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        if (!email || !feedback) {
            throw new Error('Email and feedback are required');
        }
        captureFeedback(
            {
                message: feedback,
                email,
            },
            {
                includeReplay: false,
            }
        );

        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className='w-110 max-w-[95vw] bg-white rounded-md px-6 py-4 flex flex-col'>
                <div className='flex items-center gap-3'>
                    <span className='h-px -mt-2.5 flex-1 bg-gray' />
                    <Text variant='h1' className='mb-3 text-ut-burntorange'>
                        Thank you!
                    </Text>
                    <span className='h-px -mt-2.5 flex-1 bg-gray' />
                </div>
                <Text variant='p' className='text-ut-black'>
                    Your feedback has been submitted. You may close this window.
                </Text>
                <div className='flex justify-end mt-1'>
                    <Button variant='filled' color='ut-burntorange' onClick={handleClose}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-110 max-w-[95vw] bg-white rounded-md px-6 py-4'>
            <div className='flex justify-between items-center'>
                <Text as='h1' variant='h1' className='text-ut-burntorange'>
                    Longhorn Feedback
                </Text>
                <Button
                    variant='minimal'
                    size='small'
                    color='ut-black'
                    icon={XIcon}
                    onClick={handleClose}
                    title='Close'
                />
            </div>
            <Text variant='p' as='p' className='text-ut-black mt-1.5'>
                Help us make UT Registration Plus even better!
            </Text>

            <form onSubmit={submitFeedback} className='flex flex-col gap-3 mt-5'>
                <div>
                    <label htmlFor='email' className='mb-2 flex items-center text-ut-black'>
                        <Text variant='small'>Your @utexas.edu Email</Text>
                        <span className='ml-3 h-px flex-1 bg-ut-offwhite' />
                    </label>
                    <Input
                        type='email'
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='bevo@utexas.edu'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='feedback' className='mb-2 flex items-center text-ut-black'>
                        <Text variant='small'>Your Feedback</Text>
                        <span className='ml-3 h-px flex-1 bg-ut-offwhite' />
                    </label>
                    <textarea
                        id='feedback'
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        className='min-h-30 w-full resize-none border border-ut-offwhite/50 rounded px-spacing-4 py-spacing-3 text-[1rem] text-ut-black placeholder:text-gray focus:outline-none focus:ring-0'
                        placeholder='I wish UT Registration Plus could...'
                        required
                    />
                </div>

                <div className='mt-2 flex items-center justify-end gap-4'>
                    <Button variant='minimal' color='ut-burntorange' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='filled' color='ut-burntorange' type='submit'>
                        Send Feedback
                    </Button>
                </div>
            </form>
        </div>
    );
}
