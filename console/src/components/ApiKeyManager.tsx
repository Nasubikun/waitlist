import { useState } from 'react';

interface ApiKeyManagerProps {
    userId: string;
    apiKey: string;
    onLogout: () => void;
}

const ApiKeyManager = ({ userId, apiKey, onLogout }: ApiKeyManagerProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error('クリップボードへのコピーに失敗しました:', err);
            });
    };

    return (
        <div className="api-key-container">
            <div className="user-info">
                <h3>ユーザー情報</h3>
                <p><strong>ユーザーID:</strong> {userId}</p>
            </div>

            <div className="api-key-display">
                <h3>APIキー</h3>
                <div className="api-key-value">
                    <input
                        type="text"
                        value={apiKey}
                        readOnly
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                        onClick={copyToClipboard}
                        className="copy-button"
                        title="クリップボードにコピー"
                    >
                        {isCopied ? '✓ コピー完了' : 'コピー'}
                    </button>
                </div>
                <p className="api-key-info">
                    このAPIキーは、ウェイトリストへのユーザー登録に使用します。
                    安全に保管してください。
                </p>
            </div>

            <div className="actions">
                <button onClick={onLogout} className="secondary-button">
                    ログアウト
                </button>
            </div>
        </div>
    );
};

export default ApiKeyManager;