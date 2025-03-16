import { useState } from 'react';
import UserAuth from './UserAuth';
import ApiKeyManager from './ApiKeyManager';
import ApiKeyList from './ApiKeyList';
import WaitlistTable from './WaitlistTable';

const Dashboard = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [showApiKeyList, setShowApiKeyList] = useState(false);

    // ユーザー認証時の処理
    const handleUserAuthenticated = (authenticatedUserId: string) => {
        setUserId(authenticatedUserId);
        setShowApiKeyList(true);
    };

    // APIキー選択時の処理
    const handleApiKeySelected = (selectedApiKey: string) => {
        setApiKey(selectedApiKey);
        setShowApiKeyList(false);
    };

    // APIキーリストに戻る処理
    const handleBackToApiKeyList = () => {
        setShowApiKeyList(true);
    };

    // ログアウト処理
    const handleLogout = () => {
        setUserId(null);
        setApiKey(null);
        setShowApiKeyList(false);
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>ウェイトリストSaaS</h1>
                <p className="subtitle">マルチテナントウェイトリスト管理システム</p>
            </header>

            <main className="dashboard-content">
                {!userId ? (
                    // 未認証の場合はログイン画面を表示
                    <UserAuth onUserAuthenticated={handleUserAuthenticated} />
                ) : showApiKeyList ? (
                    // APIキー一覧画面を表示
                    <ApiKeyList
                        userId={userId}
                        onSelectApiKey={handleApiKeySelected}
                        onLogout={handleLogout}
                    />
                ) : (
                    // 選択されたAPIキーの管理画面とウェイトリスト一覧を表示
                    <div className="authenticated-content">
                        <ApiKeyManager
                            userId={userId}
                            apiKey={apiKey!}
                            onLogout={handleLogout}
                            onBackToList={handleBackToApiKeyList}
                        />
                        <WaitlistTable apiKey={apiKey!} />
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