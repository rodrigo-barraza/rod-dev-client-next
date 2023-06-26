import FetchWrapper from '@/wrappers/FetchWrapper';

const EventApiLibrary = {
    RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    SESSION_SERVICE: 'session-service',
    RENDER_SERVICE: 'render-service',
    
    async postRender(prompt: string, sampling: string, cfg: number, style: string, negativePrompt: string): Promise<Response> {
        const method = 'POST';
        const form = {
            prompt: prompt,
            negativePrompt: negativePrompt,
            sampler: sampling,
            cfg: cfg,
            style: style,
        };
        const url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/render`;
        try {
            if (typeof window !== 'undefined') {
            }
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Session': sessionStorage.id,
                'Local': localStorage.id,
            })
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(form),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.log(error)
        }
    },
    async getRenderNew(id?: string) {
        let data, error, response;
        const method = 'GET';
        let searchParams;
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/render`;
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
            })

            if (typeof window !== 'undefined') {
                headers['Session'] = sessionStorage.id
                headers['Local'] = localStorage.id
            }

            if (id) {
                searchParams = new URLSearchParams({
                    id: id
                })
                url = `${url}?${searchParams.toString()}`
            }

            response = await fetch(url, {
                method: method,
                headers: headers,
            });
            if (response.ok) {
                data = response
            } else {
                error = response
            }
                
        } catch (err) {
            error = err
        }
        return { data, error, response }
    },
    async getRenders(limit?: string, mode?: string) {
        const method = 'GET';
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/renders`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (limit) { searchParams.append('limit', limit) }
        if (mode) { searchParams.append('mode', mode) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async getLikedRenders(limit?: string) {
        const method = 'GET';
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/likes`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (limit) { searchParams.append('limit', limit) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async getRender(id?: string) {
        const method = 'GET';
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/render`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (id) { searchParams.append('id', id) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async deleteRender(id?: string) {
        const method = 'DELETE';
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/render`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (id) { Object.assign(body, { id: id }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async getCount() {
        const method = 'GET'
        const url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/count`
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async getStatus() {
        const method = 'GET';
        let url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/status`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default EventApiLibrary;
