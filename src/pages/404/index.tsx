import 'uno.css';
import { createRoot } from 'react-dom/client';
import Page404 from './Page404';

// biome-ignore lint/style/noNonNullAssertion: This exists
createRoot(document.getElementById('root')!).render(<Page404 />);
