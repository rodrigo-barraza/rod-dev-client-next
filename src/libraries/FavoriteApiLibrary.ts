import FetchWrapper from '../wrappers/FetchWrapper';

const FavoriteApiLibrary = {
    // RODRIGO_SERVICE: 'http://localhost:7777/',
    RODRIGO_SERVICE: 'https://api.rod.dev/',
    // RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    FAVORITE_SERVICE: 'favorite-service',

    async postFavorite(renderId?: string) {
        const method = 'POST';
        let url = `${this.RODRIGO_SERVICE}${this.FAVORITE_SERVICE}/favorite`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (renderId) { Object.assign(body, { renderId: renderId }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async deleteFavorite(renderId?: string) {
        const method = 'DELETE';
        let url = `${this.RODRIGO_SERVICE}${this.FAVORITE_SERVICE}/favorite`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (renderId) { Object.assign(body, { renderId: renderId }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default FavoriteApiLibrary;
