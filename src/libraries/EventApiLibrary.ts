const EventApiLibrary = {
    RODRIGO_SERVICE: window.location.hostname === 'localhost' ? 'https://apis.rod.dev/' : 'https://api.rod.dev/',
    SESSION_SERVICE: 'session-service',
    
    async postEvent(form: object) {
        const method = 'POST';
        const url = `${this.RODRIGO_SERVICE}${this.SESSION_SERVICE}/event`;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
    async postSession(duration: number, width: number, height: number) {
        const method = 'POST';
        const form = {
            duration: duration,
            width: width,
            height: height,
        };
        const url = `${this.RODRIGO_SERVICE}${this.SESSION_SERVICE}/session`;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};

export default EventApiLibrary;
