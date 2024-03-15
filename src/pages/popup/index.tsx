import 'uno.css';

import PopupMain from '@views/components/PopupMain';
import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<PopupMain />);
} else {
    throw new Error('Could not find root element');
}
