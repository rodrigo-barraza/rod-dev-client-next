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
    async postRender(prompt: string, sampling: string, cfg: number, negativePrompt: string): Promise<Response> {
        const method = 'POST';
        const form = {
            prompt: prompt,
            sampler: sampling,
            cfg: cfg,
            negativePrompt: negativePrompt,
        };
        const url = `${this.RODRIGO_SERVICE}${this.RENDER_SERVICE}/render`;
        try {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Session': sessionStorage.id,
                'Local': localStorage.id,
            })
            console.log(url)
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
    }
};

export default EventApiLibrary;
