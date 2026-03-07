import 'uno.css';

import { X } from '@phosphor-icons/react';
import { captureFeedback } from '@sentry/react';
import React, { useState } from 'react';

import { Button } from './common/Button';
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

        await captureFeedback(
            {
                message: feedback || 'No feedback provided',
                email,
                tags: {
                    version: chrome.runtime.getManifest().version,
                },
            },
            {
                includeReplay: false,
            }
        );

        setEmail('');
        setFeedback('');
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className='max-w-[calc(100vw-2rem)] w-[380px] flex flex-col bg-white p-4'>
                <Text variant='h2' className='mb-3 text-ut-burntorange'>
                    Thank you
                </Text>
                <Text variant='p' className='mb-6 text-ut-black'>
                    Your feedback has been submitted. You may close this window.
                </Text>
                <div className='flex justify-end'>
                    <Button variant='filled' color='ut-burntorange' className='w-[165px]' onClick={handleClose}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-[calc(100vw-2rem)] w-[380px] bg-white p-4'>
            <div className='mb-3 flex items-start justify-between gap-3'>
                <div className='min-w-0 flex-1'>
                    <Text as='h2' variant='h2' className='block text-ut-burntorange !font-bold'>
                        Longhorn Feedback
                    </Text>
                    <Text as='p' variant='small' className='mt-1 block text-ut-black'>
                        Help us make UT Registration plus even better!
                    </Text>
                </div>
                <Button
                    variant='minimal'
                    size='small'
                    color='ut-black'
                    icon={X}
                    onClick={handleClose}
                    title='Close'
                />
            </div>

            <form onSubmit={submitFeedback} className='flex flex-col gap-3'>
                <div>
                    <label htmlFor='email' className='mb-2 flex items-center text-ut-black'>
                        <Text variant='small'>Your @utexas.edu email</Text>
                        <span className='ml-3 h-[1px] flex-1 bg-ut-offwhite' />
                    </label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='h-10 w-full border border-ut-offwhite rounded px-3 text-sm text-ut-black focus:border-ut-burntorange placeholder:text-sm placeholder:text-ut-gray focus:outline-none'
                        placeholder='bevo@utexas.edu'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='feedback' className='mb-2 flex items-center text-ut-black'>
                        <Text variant='small'>Your Feedback</Text>
                        <span className='ml-3 h-[1px] flex-1 bg-ut-offwhite' />
                    </label>
                    <textarea
                        id='feedback'
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        className='h-[136px] w-full resize-none border border-ut-offwhite rounded px-3 py-2 text-sm text-ut-black focus:border-ut-burntorange placeholder:text-sm placeholder:text-ut-gray focus:outline-none'
                        placeholder='I wish UT Registration Plus could...'
                        required
                    />
                </div>

                <div className='mt-2 flex items-center justify-end gap-4'>
                    <button
                        type='button'
                        className='h-8 border-none bg-transparent px-3 text-ut-burntorange hover:bg-ut-burntorange/8 btn'
                        onClick={handleClose}
                    >
                        <Text variant='small'>Cancel</Text>
                    </button>
                    <Button
                        variant='filled'
                        size='small'
                        color='ut-burntorange'
                        className='h-8 w-[138px] px-3'
                    >
                        Send Feedback
                    </Button>
                </div>
            </form>
        </div>
    );
}
