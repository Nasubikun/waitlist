import { useState, useEffect } from 'react';
import { getApiKeys, generateApiKey, ApiKeyInfo } from '../services/api';

interface ApiKeyListProps {
    userId: string;
    onSelectApiKey: (apiKey: string) => void;
    onLogout: () => void;
}

const ApiKeyList = ({ userId, onSelectApiKey, onLogout }: ApiKeyListProps) => {
    const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // APIキー一覧を取得する
    const fetchApiKeys = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const keys = await getApiKeys(userId);
            setApiKeys(keys);
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    // 新しいAPIキーを生成する
    const handleGenerateApiKey = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            await generateApiKey(userId);
            // 生成後に一覧を更新
            fetchApiKeys();
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsGenerating(false);
        }
    };

    // 日付をフォーマットする
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // コンポーネントマウント時にAPIキー一覧を取得
    useEffect(() => {
        fetchApiKeys();
    }, [userId]);

    return (
        <div className="api-key-list-container">
            <div className="user-info">
                <h3>ユーザー情報</h3>
                <p><strong>ユーザーID:</strong> {userId}</p>
            </div>

            <div className="api-key-list">
                <div className="api-key-list-header">
                    <h3>APIキー一覧</h3>
                    <button
                        onClick={handleGenerateApiKey}
                        disabled={isGenerating}
                        className="primary-button"
                    >
                        {isGenerating ? '生成中...' : '新規APIキー作成'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading">データを読み込み中...</div>
                ) : apiKeys.length > 0 ? (
                    <table className="api-key-table">
                        <thead>
                            <tr>
                                <th>APIキー</th>
                                <th>作成日時</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map((key, index) => (
                                <tr key={index}>
                                    <td className="api-key-cell">{key.api_key}</td>
                                    <td>{formatDate(key.created_at)}</td>
                                    <td>
                                        <button
                                            onClick={() => onSelectApiKey(key.api_key)}
                                            className="select-button"
                                        >
                                            選択
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        APIキーがありません。「新規APIキー作成」ボタンをクリックして作成してください。
                    </div>
                )}
            </div>

            <div className="actions">
                <button onClick={onLogout} className="secondary-button">
                    ログアウト
                </button>
                <button onClick={fetchApiKeys} className="refresh-button">
                    更新
                </button>
            </div>
        </div>
    );
};

export default ApiKeyList;