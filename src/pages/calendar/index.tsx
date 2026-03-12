import 'uno.css';

import { createRoot } from 'react-dom/client';

import CalendarMain from './CalendarMain';

// biome-ignore lint/style/noNonNullAssertion: This exists
createRoot(document.getElementById('root')!).render(<CalendarMain />);
