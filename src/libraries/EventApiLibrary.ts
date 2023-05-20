const EventApiLibrary = {
    // RODRIGO_SERVICE: 'http://localhost:7777/',
    RODRIGO_SERVICE: 'https://api.rod.dev/',
    // RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    SESSION_SERVICE: 'session-service',
    RENDER_SERVICE: 'render-service',
    
    async postEvent(form: object): Promise<Response> {
        const method = 'POST';
        const url = `${this.RODRIGO_SERVICE}${this.SESSION_SERVICE}/event`;
        // try {
            if (typeof window !== 'undefined') {
            }
        //     const headers = new Headers({
        //         'Content-Type': 'application/json',
        //         'Session': sessionStorage.id,
        //         'Local': localStorage.id,
        //     })

        //     const response = await fetch(url, {
        //         method: method,
        //         headers: headers,
        //         body: JSON.stringify(form),
        //     });

        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response;
        // } catch (error) {
        //     console.log(error);
        // }
    },
    async postSession(duration: number, width: number, height: number): Promise<Response> {
        const method = 'POST';
        const form = {
            duration: duration,
            width: width,
            height: height,
        };
        const url = `${this.RODRIGO_SERVICE}${this.SESSION_SERVICE}/session`;
        // try {
            if (typeof window !== 'undefined') {
            }
        //     const headers = new Headers({
        //         'Content-Type': 'application/json',
        //         'Session': sessionStorage.id,
        //         'Local': localStorage.id,
        //     })

        //     const response = await fetch(url, {
        //         method: method,
        //         headers: headers,
        //         body: JSON.stringify(form),
        //     });
        //     if (!response.ok) {
        //         throw new Error(`HTTP error! status: ${response.status}`);
        //     }
        //     return response;
        // } catch (error) {
        //     console.log(error)
        // }
    },
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
    async getRender(id?: string) {
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

            const response = await fetch(url, {
                method: method,
                headers: headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.log(123, error)
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
    async getRandom() {
        const method = 'GET';
        const url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/random`;
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
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.log(error)
        }
    },
    async getRandomNew() {
        let data, error, response;
        const method = 'GET';
        const url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/random`;
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
            })

            if (typeof window !== 'undefined') {
                headers['Session'] = sessionStorage.id
                headers['Local'] = localStorage.id
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
};

export default EventApiLibrary;
