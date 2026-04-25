import ApiConstants from '@/constants/ApiConstants';

const EventApiLibrary = {
    async postEvent(form: object): Promise<Response | void> {
        const method = 'POST';
        const url = `${ApiConstants.RODRIGO_SERVICE}${ApiConstants.SESSION_SERVICE}/event`;
        if (typeof window !== 'undefined') {
            // Event tracking currently disabled
        }
    },

    async postSession(duration: number, width: number, height: number): Promise<Response | void> {
        const method = 'POST';
        const form = {
            duration: duration,
            width: width,
            height: height,
        };
        const url = `${ApiConstants.RODRIGO_SERVICE}${ApiConstants.SESSION_SERVICE}/session`;
        if (typeof window !== 'undefined') {
            // Session tracking currently disabled
        }
    },
};

export default EventApiLibrary;
