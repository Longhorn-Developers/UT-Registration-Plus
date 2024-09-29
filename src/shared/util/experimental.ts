export let toggleIcons: boolean = false;
export function enableIcons() {
    toggleIcons = true;
}

export function disableIcons() {
    toggleIcons = false;
}

export function getIcons(): boolean {
    return toggleIcons;
}
