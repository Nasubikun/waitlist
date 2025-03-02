import { useState, FormEvent } from 'react';
import { generateApiKey } from '../services/api';

interface UserAuthProps {
    onApiKeyGenerated: (userId: string, apiKey: string) => void;
}

const UserAuth = ({ onApiKeyGenerated }: UserAuthProps) => {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId.trim()) {
            setError('ユーザーIDを入力してください');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const apiKey = await generateApiKey(userId);
            onApiKeyGenerated(userId, apiKey);
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>ウェイトリストコンソール</h2>
            <p>ユーザーIDを入力してAPIキーを生成してください</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="userId">ユーザーID</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="ユーザーIDを入力"
                        disabled={isLoading}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" disabled={isLoading} className="primary-button">
                    {isLoading ? 'ロード中...' : 'APIキーを生成'}
                </button>
            </form>
        </div>
    );
};

export default UserAuth;