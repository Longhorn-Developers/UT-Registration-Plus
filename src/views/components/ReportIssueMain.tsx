import 'uno.css';

import { captureFeedback } from '@sentry/react';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

import { Button } from './common/Button';
import Text from './common/Text/Text';

/**
 * ReportIssueMain component renders a feedback form for users to submit their email and feedback.
 *
 * @returns The rendered component.
 */
export default function ReportIssueMain(): JSX.Element {
    const queryClient = useQueryClient();

    const { data: emailAddress } = useQuery({
        queryKey: ['settings', 'emailAddress'],
        queryFn: () => OptionsStore.get('emailAddress'),
        staleTime: Infinity, // Prevent loading state on refocus
    });

    const { mutate: setEmailAddress } = useMutation({
        mutationKey: ['settings', 'emailAddress'],
        mutationFn: async ({ rememberMyEmail, emailAddress }: { rememberMyEmail: boolean; emailAddress: string }) => {
            queryClient.setQueryData(['settings', 'emailAddress'], emailAddress);
            if (rememberMyEmail) {
                OptionsStore.set('emailAddress', emailAddress);
            }
        },
    });

    const { data: rememberMyEmail } = useQuery({
        queryKey: ['settings', 'rememberMyEmail'],
        queryFn: () => OptionsStore.get('rememberMyEmail'),
        staleTime: Infinity, // Prevent loading state on refocus
    });

    const { mutate: setRememberMyEmail } = useMutation({
        mutationKey: ['settings', 'rememberMyEmail'],
        mutationFn: async ({ rememberMyEmail, emailAddress }: { rememberMyEmail: boolean; emailAddress: string }) => {
            queryClient.setQueryData(['settings', 'rememberMyEmail'], rememberMyEmail);
            OptionsStore.set('rememberMyEmail', rememberMyEmail);

            if (rememberMyEmail) {
                OptionsStore.set('emailAddress', emailAddress);
            } else {
                OptionsStore.set('emailAddress', '');
            }
        },
    });

    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitFeedback = async () => {
        if (!emailAddress || !feedback) {
            throw new Error('Email and feedback are required');
        }

        // Send the feedback to Sentry
        captureFeedback(
            {
                message: feedback || 'No feedback provided',
                email: emailAddress,
                tags: {
                    version: chrome.runtime.getManifest().version,
                },
            },
            {
                includeReplay: false,
            }
        );

        // Close the dialog
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className='w-92 flex flex-col rounded-lg bg-white p-6 shadow-lg'>
                <Text variant='h2' className='my-4'>
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

    return (
        <div className='w-92 bg-white p-6'>
            <h2 className='my-4 text-2xl text-ut-burntorange font-bold'>Longhorn Feedback</h2>
            <p className='mb-4 text-sm text-ut-black'>Help us make UT Registration Plus even better!</p>

            <form onSubmit={submitFeedback}>
                <div className='mb-1'>
                    <label htmlFor='email' className='mb-1 block text-sm text-ut-black font-medium'>
                        Your @utexas.edu email
                    </label>
                    <div className='flex'>
                        <input
                            type='email'
                            id='email'
                            value={emailAddress}
                            onChange={e =>
                                setEmailAddress({
                                    emailAddress: e.target.value,
                                    rememberMyEmail: rememberMyEmail ?? false,
                                })
                            }
                            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                            placeholder='bevo@utexas.edu'
                            required
                        />
                    </div>
                </div>

                <div className='mb-4'>
                    <label className='mb-1 flex cursor-pointer content-center gap-1.25 text-sm text-ut-black font-medium'>
                        <input
                            type='checkbox'
                            className='cursor-pointer'
                            checked={rememberMyEmail}
                            onChange={e =>
                                setRememberMyEmail({
                                    rememberMyEmail: e.target.checked,
                                    emailAddress: emailAddress ?? '',
                                })
                            }
                        />{' '}
                        Remember my email
                    </label>
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
