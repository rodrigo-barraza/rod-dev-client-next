import FetchWrapper from '@/wrappers/FetchWrapper';

const GymApiLibrary = {
    RODRIGO_SERVICE: process.env.NEXT_PUBLIC_RODRIGO_SERVICE,
    GYM_SERVICE: 'gym-service',
    async getJournal() {
        const method = 'GET';
        let url = `${this.RODRIGO_SERVICE}${this.GYM_SERVICE}/journal`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
    async postJournal(exercise: string, reps: string, weight: string, unit: string, style: string, stance: string, equipment: string, position: string) {
        const method = 'POST';
        let url = `${this.RODRIGO_SERVICE}${this.GYM_SERVICE}/journal`;
        const headers = new Headers({})
        const body = {}
        const searchParams = new URLSearchParams({})
        if (exercise) { Object.assign(body, { exercise: exercise }) }
        if (reps) { Object.assign(body, { reps: reps }) }
        if (weight) { Object.assign(body, { weight: weight }) }
        if (unit) { Object.assign(body, { unit: unit }) }
        if (style) { Object.assign(body, { style: style }) }
        if (stance) { Object.assign(body, { stance: stance }) }
        if (equipment) { Object.assign(body, { equipment: equipment }) }
        if (position) { Object.assign(body, { position: position }) }
        return await FetchWrapper.fetch(method, url, headers, body, searchParams)
    },
};

export default GymApiLibrary;
