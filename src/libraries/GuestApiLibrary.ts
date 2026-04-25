import FetchWrapper from '@/wrappers/FetchWrapper';
import ApiConstants from '@/constants/ApiConstants';

const S = ApiConstants.GUEST_SERVICE;

const GuestApiLibrary = {
    async getGuest(ip?: string) {
        const headers: Record<string, string> = {};
        if (ip) headers.ip = ip;
        return FetchWrapper.get(S, 'guest', undefined, headers);
    },
};

export default GuestApiLibrary;
