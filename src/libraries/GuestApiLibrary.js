import FetchWrapper from '@/wrappers/FetchWrapper';

const GuestApiLibrary = {
    RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    GUEST_SERVICE: 'guest-service',

    async getGuest(ip) {
        const method = 'GET'
        const url = `${this.RODRIGO_SERVICE}${this.GUEST_SERVICE}/guest`
        const headers = new Headers({})
        if (ip) { headers.append('ip', ip) }
        const body = {}
        const searchParams = new URLSearchParams({})
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default GuestApiLibrary;
