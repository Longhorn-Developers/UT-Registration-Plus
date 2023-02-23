// this is a custom wrapper around react-devtools
// that changes it so that we only send messages to the devtools when the current tab is active;
import { connectToDevTools } from 'react-devtools-core';

// connect to the devtools server
let ws = new WebSocket('ws://localhost:8097');

connectToDevTools({
    websocket: ws,
});

// when the tab's visibile state changes, we connect or disconnect from the devtools
const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
        ws = new WebSocket('ws://localhost:8097');
        connectToDevTools({
            websocket: ws,
        });
    } else {
        ws.close();
    }
};

document.addEventListener('visibilitychange', onVisibilityChange);
