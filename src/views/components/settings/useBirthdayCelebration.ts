import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BIRTHDAY_CELEBRATION_DEBOUNCE, BIRTHDAY_CELEBRATION_DURATION, LHD_BIRTHDAY } from './constants';

/**
 * Custom hook for birthday celebration particles
 */
export const useBirthdayCelebration = () => {
    const [showParticles, setShowParticles] = useState(false);
    const [particlesInit, setParticlesInit] = useState(false);
    const [lastCelebration, setLastCelebration] = useState(0);

    const isBirthday = useMemo(() => {
        const today = new Date();
        return today.getMonth() === LHD_BIRTHDAY.month && today.getDate() === LHD_BIRTHDAY.day;
    }, []);

    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        });
    }, []);

    const triggerCelebration = useCallback(() => {
        if (!isBirthday) return;

        const now = Date.now();
        // Debounce: prevent triggering again within BIRTHDAY_CELEBRATION_DEBOUNCE ms
        if (now - lastCelebration < BIRTHDAY_CELEBRATION_DEBOUNCE) return;

        setLastCelebration(now);
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), BIRTHDAY_CELEBRATION_DURATION);
    }, [isBirthday, lastCelebration]);

    const particlesOptions: ISourceOptions = useMemo(
        () => ({
            fullScreen: { enable: true, zIndex: 1 },
            particles: {
                color: { value: ['#BF5700', '#333F48', '#FFFFFF'] }, // UT colors
                move: {
                    direction: 'bottom',
                    enable: true,
                    outModes: {
                        default: 'out',
                    },
                    size: true,
                    speed: {
                        min: 1,
                        max: 3,
                    },
                },
                number: {
                    value: 500,
                    density: {
                        enable: true,
                        area: 800,
                    },
                },
                opacity: {
                    value: 1,
                    animation: {
                        enable: false,
                        startValue: 'max',
                        destroy: 'min',
                        speed: 0.3,
                        sync: true,
                    },
                },
                rotate: {
                    value: {
                        min: 0,
                        max: 360,
                    },
                    direction: 'random',
                    move: true,
                    animation: {
                        enable: true,
                        speed: 60,
                    },
                },
                tilt: {
                    direction: 'random',
                    enable: true,
                    move: true,
                    value: {
                        min: 0,
                        max: 360,
                    },
                    animation: {
                        enable: true,
                        speed: 60,
                    },
                },
                shape: {
                    type: ['circle', 'square'],
                    options: {},
                },
                size: {
                    value: {
                        min: 2,
                        max: 4,
                    },
                },
                roll: {
                    darken: {
                        enable: true,
                        value: 30,
                    },
                    enlighten: {
                        enable: true,
                        value: 30,
                    },
                    enable: true,
                    speed: {
                        min: 15,
                        max: 25,
                    },
                },
                wobble: {
                    distance: 30,
                    enable: true,
                    move: true,
                    speed: {
                        min: -15,
                        max: 15,
                    },
                },
            },
        }),
        []
    );

    return { showParticles, particlesInit, particlesOptions, triggerCelebration, isBirthday };
};
