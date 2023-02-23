import './hotReload';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { devStore } from 'src/shared/storage/devStore';

const manifest = chrome.runtime.getManifest();

interface JSONEditorProps {
    data: any;
    onChange: (updates: any) => void;
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
    const [localStorage, setLocalStorage] = React.useState<any>({});
    const [syncStorage, setSyncStorage] = React.useState<any>({});
    const [sessionStorage, setSessionStorage] = React.useState<any>({});

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                devStore.setWasDebugTabVisible(true);
            } else {
                devStore.setWasDebugTabVisible(false);
            }
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

        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local') {
                setLocalStorage({ ...localStorage, ...changes });
            } else if (areaName === 'sync') {
                setSyncStorage({ ...syncStorage, ...changes });
            } else if (areaName === 'session') {
                setSessionStorage({ ...sessionStorage, ...changes });
            }
        });
    }, []);

    const handleEditStorage = (areaName: string) => (changes: Record<string, any>) => {
        chrome.storage[areaName].set(changes);
    };

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

render(<DevDashboard />, document.getElementById('root'));
