import { useEffect, useState } from "react";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatRelative(timestamp: number): string {
    const diff = timestamp - Date.now();

    if (Math.abs(diff) < MINUTE) return "<1 minute ago";
    if (Math.abs(diff) < HOUR)
        return rtf.format(Math.round(diff / MINUTE), "minute");
    if (Math.abs(diff) < DAY)
        return rtf.format(Math.round(diff / HOUR), "hour");
    return rtf.format(Math.round(diff / DAY), "day");
}

function getRefreshInterval(timestamp: number): number {
    const elapsed = Date.now() - timestamp;
    if (elapsed < MINUTE) return MINUTE - elapsed;
    if (elapsed < HOUR) return MINUTE;
    return HOUR;
}

/**
 * Returns a relative time string (e.g. "5 seconds ago") that auto-updates.
 */
export default function useRelativeTime(
    timestamp: number | null | undefined,
): string | null {
    const [text, setText] = useState(() =>
        timestamp ? formatRelative(timestamp) : null,
    );

    useEffect(() => {
        if (!timestamp) {
            setText(null);
            return;
        }

        setText(formatRelative(timestamp));

        const id = setInterval(() => {
            setText(formatRelative(timestamp));
        }, getRefreshInterval(timestamp));

        return () => clearInterval(id);
    }, [timestamp]);

    return text;
}
