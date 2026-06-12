import renderRoot from '@shared/util/renderRoot';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';
import { Button } from 'src/views/components/common/Button';

export default function UninstallPage() {
    const chromeReviewUrl =
        'https://chromewebstore.google.com/detail/ut-registration-plus/hboadpjkoaieogjimneceaahlppnipaa/reviews?hl=en';

    return (
        <ExtensionRoot>
            <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
                <h1>Thanks for using UT Registration Plus</h1>
                <p>
                    We're grateful you've used UTRP. If it helped you during your time at UT, we'd be so thankful if
                    you'd leave a quick review.
                </p>
                <p>Congrats if you're graduating — best of luck!</p>
                <a href={chromeReviewUrl} target='_blank' rel='noopener noreferrer'>
                    <Button variant='outline' color='ut-burntorange'>
                        Leave a Review!
                    </Button>
                </a>
            </div>
        </ExtensionRoot>
    );
}
