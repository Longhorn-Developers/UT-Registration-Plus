import 'uno.css';

import { captureFeedback } from '@sentry/react';
import React, { useState } from 'react';

import { Button } from './common/Button';
import Text from './common/Text/Text';

/**
 * ReportIssueMain component renders a feedback form for users to submit their email and feedback.
 *
 * @returns The rendered component.
 */
export default function ReportIssueMain(): JSX.Element {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitFeedback = async () => {
        if (!email || !feedback) {
            throw new Error('Email and feedback are required');
        }
        // Here you would typically send the feedback to a server
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

        // Reset form fields and close the dialog
        setEmail('');
        setFeedback('');
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className='w-80 flex flex-col rounded-lg bg-white p-6 shadow-lg'>
                <Text variant='h2' className='mb-4'>
                    Thank you
                </Text>
                <Text variant='p' className='mb-6'>
                    Your feedback has been submitted. You may close this window.
                </Text>
                <Button variant='filled' color='ut-green' className='border-0' onClick={() => window.close()}>
                    Done
                </Button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className='w-80 bg-white p-6'>
                <h2 className='mb-4 text-2xl text-orange font-bold'>{`Hook'em Horns!`}</h2>
                <p className='mb-6 text-gray-600'>Your feedback is music to our ears. Thanks for helping us improve!</p>
                <button
                    className='w-full rounded bg-orange-600 px-4 py-2 text-white font-bold transition duration-300 hover:bg-orange-700'
                    onClick={() => window.close()}
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className='w-80 bg-white p-6'>
            <h2 className='mb-4 text-2xl text-ut-burntorange font-bold'>Longhorn Feedback</h2>
            <p className='mb-4 text-sm text-ut-black'>Help us make UT Registration Plus even better!</p>

            <form onSubmit={submitFeedback}>
                <div className='mb-4'>
                    <label htmlFor='email' className='mb-1 block text-sm text-ut-black font-medium'>
                        Your @utexas.edu email
                    </label>
                    <div className='flex'>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                            placeholder='bevo@utexas.edu'
                            required
                        />
                    </div>
                </div>

                <div className='mb-4'>
                    <label htmlFor='feedback' className='mb-1 block text-sm text-ut-black font-medium'>
                        Your feedback
                    </label>
                    <div className='flex'>
                        <textarea
                            id='feedback'
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            className='h-24 w-full resize-none border border-gray-300 rounded-md px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-orange-500'
                            placeholder='I wish UT Registration Plus could...'
                            required
                        />
                    </div>
                </div>

                <Button
                    onClick={submitFeedback}
                    variant='filled'
                    color='ut-orange'
                    className='w-full border-0 rounded bg-orange px-4 py-2 text-white font-bold transition duration-300 hover:bg-orange-700'
                >
                    Send Feedback
                </Button>
            </form>
        </div>
    );
}
