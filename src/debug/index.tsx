import { DevStore } from '@shared/storage/DevStore';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const manifest = chrome.runtime.getManifest();

/**
 * Handles editing the storage for a specific area.
 *
 * @param areaName - The name of the storage area.
 * @returns A function that accepts changes and sets them in the storage.
 */
const handleEditStorage = (areaName: 'local' | 'sync' | 'session') => (changes: Record<string, unknown>) => {
    chrome.storage[areaName].set(changes);
};

interface JSONEditorProps {
    data: unknown;
    onChange: ReturnType<typeof handleEditStorage>;
}

function JSONEditor(props: JSONEditorProps) {
    const { data, onChange } = props;
    const [isEditing, setIsEditing] = React.useState(false);
    const [json, setJson] = React.useState(JSON.stringify(data, null, 2));

    useEffect(() => {
        setJson(JSON.stringify(data, null, 2));
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJson(e.target.value);
    };

    const handleSave = () => {
        try {
            const updates = JSON.parse(json);
            onChange(updates);
            setIsEditing(false);
        } catch (e) {
            console.error(e);

            // eslint-disable-next-line no-alert
            alert('Invalid JSON');
        }
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <div style={{ flex: 1, marginBottom: 10, gap: 10, display: 'flex' }}>
                        <button style={{ color: 'green' }} onClick={handleSave}>
                            Save
                        </button>
                        <button style={{ color: 'red' }} onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                    <textarea style={{ width: '100%', height: '300px' }} value={json} onChange={handleChange} />
                </div>
            ) : (
                <div>
                    <pre onClick={() => setIsEditing(true)}>{json}</pre>
                </div>
            )}
        </div>
    );
}
// const PrettyPrintJson = React.memo(({ data }: any) => (
//     <div>
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
// ));

function DevDashboard() {
    const [localStorage, setLocalStorage] = React.useState<Record<string, unknown>>({});
    const [syncStorage, setSyncStorage] = React.useState<Record<string, unknown>>({});
    const [sessionStorage, setSessionStorage] = React.useState<Record<string, unknown>>({});
    useKC_DABR_WASM();

    useEffect(() => {
        const onVisibilityChange = () => {
            DevStore.set('wasDebugTabVisible', document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    useEffect(() => {
        chrome.storage.local.get(null, result => {
            setLocalStorage(result);
        });

        chrome.storage.sync.get(null, result => {
            setSyncStorage(result);
        });

        chrome.storage.session.get(null, result => {
            setSessionStorage(result);
        });
    }, []);

    // listen for changes to the chrome storage to update the local storage state displayed in the dashboard
    useEffect(() => {
        const onChanged = (changes: chrome.storage.StorageChange, areaName: chrome.storage.AreaName) => {
            let copy: Record<string, unknown> = {};

            if (areaName === 'local') {
                copy = { ...localStorage };
            } else if (areaName === 'sync') {
                copy = { ...syncStorage };
            } else if (areaName === 'session') {
                copy = { ...sessionStorage };
            }

            Object.keys(changes).forEach((key: string) => {
                copy[key] = changes[key as keyof typeof changes].newValue;
            });

            if (areaName === 'local') {
                setLocalStorage(copy);
            }
            if (areaName === 'sync') {
                setSyncStorage(copy);
            }
            if (areaName === 'session') {
                setSessionStorage(copy);
            }
        };

        chrome.storage.onChanged.addListener(onChanged);

        return () => {
            chrome.storage.onChanged.removeListener(onChanged);
        };
    }, [localStorage, syncStorage, sessionStorage]);

    return (
        <div>
            <h1>
                {manifest.name} {manifest.version} - {process.env.NODE_ENV}
            </h1>
            <p>This tab is used for hot reloading and debugging. We will update this tab further in the future.</p>
            <h2>Local Storage</h2>
            <JSONEditor data={localStorage} onChange={handleEditStorage('local')} />
            <h2>Sync Storage</h2>
            <JSONEditor data={syncStorage} onChange={handleEditStorage('sync')} />
            <h2>Session Storage</h2>
            <JSONEditor data={sessionStorage} onChange={handleEditStorage('session')} />
            <br />
        </div>
    );
}

createRoot(document.getElementById('root')!).render(<DevDashboard />);
