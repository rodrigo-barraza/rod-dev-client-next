import FetchWrapper from '@/wrappers/FetchWrapper';

const LikeApiLibrary = {
    RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    FAVORITE_SERVICE: 'like-service',

    async postLike(renderId?: string, like: boolean = true) {
        const method = 'POST';
        let url = `${this.RODRIGO_SERVICE}${this.FAVORITE_SERVICE}/like`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (renderId) { Object.assign(body, { renderId: renderId }) }
        if (like) { Object.assign(body, { like: 'true' }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },

    async deleteLike(renderId?: string, like: boolean = true) {
        const method = 'POST';
        let url = `${this.RODRIGO_SERVICE}${this.FAVORITE_SERVICE}/like`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (renderId) { Object.assign(body, { renderId: renderId }) }
        if (like) { Object.assign(body, { like: 'false' }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default LikeApiLibrary;
