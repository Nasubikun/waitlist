import { useState } from 'react';
import UserAuth from './UserAuth';
import ApiKeyManager from './ApiKeyManager';
import WaitlistTable from './WaitlistTable';

const Dashboard = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);

    // APIキーが生成されたときの処理
    const handleApiKeyGenerated = (newUserId: string, newApiKey: string) => {
        setUserId(newUserId);
        setApiKey(newApiKey);
    };

    // ログアウト処理
    const handleLogout = () => {
        setUserId(null);
        setApiKey(null);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>ウェイトリストSaaS</h1>
                <p className="subtitle">マルチテナントウェイトリスト管理システム</p>
            </header>

            <main className="dashboard-content">
                {!userId || !apiKey ? (
                    // 未認証の場合はログイン画面を表示
                    <UserAuth onApiKeyGenerated={handleApiKeyGenerated} />
                ) : (
                    // 認証済みの場合はAPIキー管理とウェイトリスト一覧を表示
                    <div className="authenticated-content">
                        <ApiKeyManager
                            userId={userId}
                            apiKey={apiKey}
                            onLogout={handleLogout}
                        />
                        <WaitlistTable apiKey={apiKey} />
                    </div>
                )}
            </main>

            <footer className="dashboard-footer">
                <p>&copy; {new Date().getFullYear()} ウェイトリストSaaS</p>
            </footer>
        </div>
    );
};

export default Dashboard;