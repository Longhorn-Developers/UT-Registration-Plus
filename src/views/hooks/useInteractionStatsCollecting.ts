import { background } from '@shared/messages';
import { useEffect } from 'react';

/**
 * A hook that collects interaction stats
 */
export const useInteractionStatsCollecting = () => {
    useEffect(() => {
        const handleInteraction = () => {
            background.interactedWithScheduling();
        };

        document.addEventListener('click', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
        };
    }, []);
};
