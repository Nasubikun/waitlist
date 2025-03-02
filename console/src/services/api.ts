// APIとの通信を行うサービス

// APIのベースURL（実際の環境に合わせて変更してください）
const API_BASE_URL = 'http://localhost:8787';

// APIキーを生成する
export const generateApiKey = async (userId: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/apiKey/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error('APIキーの生成に失敗しました');
        }

        const data = await response.json();
        return data.apiKey;
    } catch (error) {
        console.error('APIキー生成エラー:', error);
        throw error;
    }
};

// ウェイトリストのユーザー情報
export interface WaitlistUser {
    email: string;
    created_at: string;
}

// ウェイトリストのユーザー一覧を取得する
export const getWaitlistUsers = async (apiKey: string): Promise<WaitlistUser[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/waitlist/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
        });

        if (!response.ok) {
            throw new Error('ウェイトリストの取得に失敗しました');
        }

        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('ウェイトリスト取得エラー:', error);
        throw error;
    }
};

// メールアドレスをウェイトリストに登録する（テスト用）
export const registerToWaitlist = async (apiKey: string, email: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey, email }),
        });

        if (!response.ok) {
            throw new Error('ウェイトリストへの登録に失敗しました');
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('ウェイトリスト登録エラー:', error);
        throw error;
    }
};