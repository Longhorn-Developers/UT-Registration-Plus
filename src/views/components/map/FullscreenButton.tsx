import React, { useEffect, useState } from 'react';

import { Button } from '../common/Button';

interface FullscreenButtonProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * FullscreenButton component provides a toggle for fullscreen mode
 *
 * @param containerRef - Reference to the container element to make fullscreen.
 *
 * @returns The rendered FullscreenButton component.
 */
export default function FullscreenButton({ containerRef }: FullscreenButtonProps): JSX.Element {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && containerRef.current) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    };

    return (
        <div className='rounded-md bg-white/90 p-2 shadow-sm'>
            <Button
                onClick={toggleFullscreen}
                color='ut-burntorange'
                variant='minimal'
                size='mini'
                className='flex items-center gap-1 px-3 py-1'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    {isFullscreen ? (
                        <path d='M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3' />
                    ) : (
                        <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />
                    )}
                </svg>
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
        </div>
    );
}
