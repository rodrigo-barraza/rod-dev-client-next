import FetchWrapper from '../wrappers/FetchWrapper';

const GuestApiLibrary = {
    RODRIGO_SERVICE: 'http://localhost:7777/',
    // RODRIGO_SERVICE: 'https://api.rod.dev/',
    // RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    GUEST_SERVICE: 'guest-service',

    async getGuest() {
        const method = 'GET'
        const url = `${this.RODRIGO_SERVICE}${this.GUEST_SERVICE}/guest`
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default GuestApiLibrary;
