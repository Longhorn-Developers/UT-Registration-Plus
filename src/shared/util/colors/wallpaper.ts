import type { HexColor } from '@shared/types/Color';
import { useEffect, useState } from 'react';
import { pickFontColor } from './base';

const cache = new Map<string, 'text-white' | 'text-theme-black'>();

export function useWallpaperFontColor(
    wallpaper?: string,
    fallbackBgColor?: HexColor
): 'text-white' | 'text-black' | 'text-theme-black' {
    const [fontColor, setFontColor] = useState(() => (wallpaper ? cache.get(wallpaper) : undefined));

    useEffect(() => {
        if (!wallpaper?.trim()) return;
        if (cache.has(wallpaper)) {
            setFontColor(cache.get(wallpaper));
            return;
        }

        const img = new Image();
        img.src = wallpaper;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 16;
            canvas.height = 16;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0, img.width, img.height * 0.45, 0, 0, 16, 16);
            const { data } = ctx.getImageData(0, 0, 16, 16);
            let totalY = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] ?? 0;
                const g = data[i + 1] ?? 0;
                const b = data[i + 2] ?? 0;
                totalY += 0.2126 * r + 0.7152 * g + 0.0722 * b;
            }

            const result = totalY / (data.length / 4) > 120 ? 'text-theme-black' : 'text-white';
            cache.set(wallpaper, result);
            setFontColor(result);
        };
    }, [wallpaper]);

    return fontColor ?? (fallbackBgColor ? pickFontColor(fallbackBgColor) : 'text-white');
}

export function getWallpaperStyle(wallpaper: string, fontColor: string) {
    const scrim =
        fontColor === 'text-white'
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)';

    return {
        backgroundImage: `${scrim}, url(${wallpaper})`,
    };
}
