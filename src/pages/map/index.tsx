import { createRoot } from 'react-dom/client';
import MapPage from './Map';

// biome-ignore lint/style/noNonNullAssertion: This exists
createRoot(document.getElementById('root')!).render(<MapPage />);
