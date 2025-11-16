import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { CookieStore } from '$lib/server/CookieStore';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ cookies }) => {
    const session = cookies.get('session');
    if (session) throw redirect(303, '/');
    return {};
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        if (dev) {
            console.log('Running in development mode');
        }

        const store = new CookieStore(cookies);
        const formData = await request.formData();
        let identifier = String(formData.get('emailOrPhone') || '').trim();
        const password = String(formData.get('password') || '').trim();

        // Normalize phone: if starts with 0 and numeric, convert to +84 + remaining digits
        const compact = identifier.replace(/\s+/g, '');
        if (/^0\d{8,}$/.test(compact)) {
            identifier = `+84${compact.slice(1)}`;
        }

        // Safe logging (never log raw password)
        console.log(`[login] submitted identifier=%s passwordLength=%d`, identifier, password.length);

        if (!identifier || !password) {
            return fail(400, { message: 'Identifier and password are required' });
        }

        // Two-step login flow (Insentecs ID):
        // 1) Create login flow (GET)
        // 2) Submit login (POST with ?flow=ID and JSON body)
        const AUTH_API_URL = env.AUTH_API_URL ?? '';
        const createFlowUrl = `${AUTH_API_URL.replace(/\/$/, '')}/self-service/login/api`;
        console.log(`[login] AUTH_API_URL=%s`, AUTH_API_URL);
        try {
            const serverFetch = globalThis.fetch;
            const createRes = await serverFetch(createFlowUrl, { method: 'GET' });
            const createText = await createRes.text();
            if (!createRes.ok) {
                console.warn('[login] create flow failed status=%d body=%s', createRes.status, createText);
                return fail(502, { message: 'Unable to start login flow' });
            }

            // parse JSON and extract flow id and csrf token
            type UiNode = { attributes?: { name?: string; value?: string } };
            type FlowResp = { id?: string; flow_id?: string; csrf_token?: string; ui?: { nodes?: UiNode[] } };
            let flowId = '' as string;
            let csrfToken = '' as string;
            try {
                const flow = JSON.parse(createText) as FlowResp;
                flowId = flow.id ?? flow.flow_id ?? '';
                // Try common Kratos layouts to find CSRF token
                if (flow.ui?.nodes) {
                    const node = flow.ui.nodes.find((n: UiNode) => n?.attributes?.name === 'csrf_token' || n?.attributes?.name === 'csrf');
                    csrfToken = node?.attributes?.value ?? '';
                }
                if (!csrfToken && typeof flow.csrf_token === 'string') csrfToken = flow.csrf_token;
            } catch (e) {
                console.error('[login] parsing create flow response failed', e);
            }

            console.log('[login] created flow id=%s csrfTokenPresent=%s', flowId, Boolean(csrfToken));

            if (!flowId) {
                return fail(500, { message: 'Login flow error (no id)' });
            }

            const submitUrl = `${AUTH_API_URL.replace(/\/$/, '')}/self-service/login?flow=${encodeURIComponent(flowId)}`;
            const body = {
                csrf_token: csrfToken,
                identifier,
                method: 'password',
                password
            } as const;
            const submitRes = await serverFetch(submitUrl, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(body)
            });

            const submitText = await submitRes.text();
            console.log('[login] submit status=%d flow=%s, okay: %s', submitRes.status, flowId, submitRes.ok);

            if (!submitRes.ok) {
                console.warn('[login] submit failed status=%d body=%s', submitRes.status, submitText);
                let message = 'Invalid credentials';
                try {
                    const errJson = JSON.parse(submitText) as { ui?: { messages?: Array<{ text?: string }> }, messages?: Array<{ text?: string }> };
                    const fromUi = errJson.ui?.messages?.[0]?.text;
                    const fromRoot = errJson.messages?.[0]?.text;
                    message = fromUi || fromRoot || message;
                    console.warn('[login] submitRes.ok false message=', message);
                } catch {
                    console.warn('[login] ignore JSON parse error');
                }
                return fail(submitRes.status, { message: message });
            }

            // Log and persist success body (truncate for cookie size)
            try {
                const parsed = JSON.parse(submitText);
                console.log('[login] submit success body=', parsed);
                const traits = parsed?.session?.identity?.traits;
                if (traits) {
                    console.log('[login] traits=', traits);
                } else {
                    console.log('[login] traits not found in response');
                }
            } catch {
                console.log('[login] submit success (non-JSON body) len=%d', submitText.length);
            }
            store.setSessionBody(submitText, { maxAge: 60 * 60 * 24 });
            // If the ID service returns a session token/cookie, the cookie will be set by that domain.
            // Here, mirror a minimal session cookie locally so our guard allows navigation.
            store.set('session', `id-flow:${flowId}:${identifier}`, { maxAge: 60 * 60 * 24 });

            throw redirect(303, '/');
        } catch (err) {
            // Let SvelteKit handle redirects
            if (err && typeof err === 'object' && 'location' in (err as Record<string, unknown>)) {
                throw err as unknown as Error;
            }
            console.error('[login] error during ID login flow', err);
            return fail(502, { message: 'Auth service unavailable' });
        }
    }
};


