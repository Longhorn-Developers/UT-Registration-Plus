import io from 'socket.io-client';
import { bMessenger } from 'src/shared/messages';

const socket = io('http://localhost:9090');
let reBuilding = false;

socket.on('disconnect', async reason => {
    reBuilding = reason.includes('transport') && !reason.includes('client');
});

socket.onAny(args => {
    console.log(args);
});

socket.on('connect', async () => {
    if (!reBuilding) {
        console.log('%c[hot-reloading] listening for changes...', 'color:white; background-color: orange;');
    } else {
        console.log(
            '%c[hot-reloading] changes detected, rebuilding and refreshing...',
            'color:white; background-color: orange;'
        );
    }
});

socket.on('reload', async () => {
    console.log('%c[hot-reloading] reloading...', 'color:white; background-color: orange;');
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs?.[0]?.id) {
            bMessenger.reloadExtension();
        }
    });
});
