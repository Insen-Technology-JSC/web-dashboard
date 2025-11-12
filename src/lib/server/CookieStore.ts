import type { Cookies } from '@sveltejs/kit';

export type CookieOptions = {
    path?: string;
    httpOnly?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    secure?: boolean;
    maxAge?: number;
    domain?: string;
};

const DEFAULT_OPTS: Required<Pick<CookieOptions, 'path' | 'httpOnly' | 'sameSite' | 'secure'>> = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true
};

export class CookieStore {
    private cookies: Cookies;
    private defaults: CookieOptions;

    constructor(cookies: Cookies, defaults?: CookieOptions) {
        this.cookies = cookies;
        this.defaults = { ...DEFAULT_OPTS, ...(defaults ?? {}) };
    }

    set(name: string, value: string, options?: CookieOptions): void {
        this.cookies.set(name, value, { ...this.defaults, ...(options ?? {}) });
    }

    get(name: string): string | undefined {
        return this.cookies.get(name);
    }

    delete(name: string, options?: CookieOptions): void {
        this.cookies.delete(name, { path: this.defaults.path, ...(options ?? {}) });
    }

    setJSON<T>(name: string, data: T, options?: CookieOptions): void {
        const text = JSON.stringify(data);
        this.set(name, CookieStore.encode(text), options);
    }

    getJSON<T = unknown>(name: string): T | undefined {
        const raw = this.get(name);
        if (!raw) return undefined;
        try {
            const text = CookieStore.decode(raw);
            return JSON.parse(text) as T;
        } catch {
            return undefined;
        }
    }

    setSessionBody(rawText: string, options?: CookieOptions): void {
        // keep cookie size safe (~4KB). Truncate to ~3KB
        const truncated = rawText.slice(0, 3000);
        const encoded = CookieStore.encode(truncated);
        this.set('session_body', encoded, options);
    }

    getSessionBody(): string | undefined {
        const raw = this.get('session_body');
        if (!raw) return undefined;
        try {
            return CookieStore.decode(raw);
        } catch {
            return undefined;
        }
    }

    static encode(text: string): string {
        return Buffer.from(text, 'utf8').toString('base64');
    }

    static decode(b64: string): string {
        return Buffer.from(b64, 'base64').toString('utf8');
    }

    clearAll(): void {
        // Lấy danh sách tất cả cookie hiện có
        const all = this.cookies.getAll();
        for (const cookie of all) {
            this.cookies.delete(cookie.name, { path: this.defaults.path });
        }
    }
}


