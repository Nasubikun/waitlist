import { useState, useEffect } from 'react';
import { getWaitlistUsers, WaitlistUser, registerToWaitlist } from '../services/api';

interface WaitlistTableProps {
    apiKey: string;
}

const WaitlistTable = ({ apiKey }: WaitlistTableProps) => {
    const [users, setUsers] = useState<WaitlistUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState<string | null>(null);

    // ウェイトリストユーザーを取得する
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const userList = await getWaitlistUsers(apiKey);
            setUsers(userList);
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    // コンポーネントマウント時にユーザーリストを取得
    useEffect(() => {
        fetchUsers();
    }, [apiKey]);

    // テスト用：新しいメールアドレスを登録
    const handleAddEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            setError('有効なメールアドレスを入力してください');
            return;
        }

        setIsAdding(true);
        setError(null);
        setAddSuccess(null);

        try {
            const message = await registerToWaitlist(apiKey, newEmail);
            setAddSuccess(message);
            setNewEmail('');
            // 登録成功後にリストを更新
            fetchUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
        } finally {
            setIsAdding(false);
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

    return (
        <div className="waitlist-container">
            <div className="waitlist-header">
                <h3>ウェイトリスト登録者一覧</h3>
                <button onClick={fetchUsers} disabled={isLoading} className="refresh-button">
                    {isLoading ? 'ロード中...' : '更新'}
                </button>
            </div>

            {/* テスト用：メールアドレス登録フォーム */}
            <div className="test-form">
                <h4>テスト用：メールアドレス登録</h4>
                <form onSubmit={handleAddEmail} className="add-email-form">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="メールアドレスを入力"
                        disabled={isAdding}
                    />
                    <button type="submit" disabled={isAdding} className="primary-button">
                        {isAdding ? '登録中...' : '登録'}
                    </button>
                </form>
                {error && <div className="error-message">{error}</div>}
                {addSuccess && <div className="success-message">{addSuccess}</div>}
            </div>

            {/* ウェイトリスト一覧テーブル */}
            <div className="waitlist-table-container">
                {isLoading ? (
                    <div className="loading">データを読み込み中...</div>
                ) : users.length > 0 ? (
                    <table className="waitlist-table">
                        <thead>
                            <tr>
                                <th>メールアドレス</th>
                                <th>登録日時</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.email}</td>
                                    <td>{formatDate(user.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        {error ? `エラー: ${error}` : 'ウェイトリストにはまだ登録者がいません'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WaitlistTable;