import React from 'react';
import { createRoot } from 'react-dom/client';

import CalendarMain from './CalendarMain';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<CalendarMain />);
} else {
    throw new Error('Could not find root element');
}
