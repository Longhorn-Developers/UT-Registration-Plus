import { createRoot } from 'react-dom/client';
import SettingsPage from './Settings';

// biome-ignore lint/style/noNonNullAssertion: This exists
createRoot(document.getElementById('root')!).render(<SettingsPage />);
