import { useState } from 'react';
import GuestApiLibrary from '@/libraries/GuestApiLibrary';

/**
 * Custom hook for guest data management.
 * Eliminates the duplicate getGuest + guestData pattern across renders/likes/generate pages.
 */
export default function useGuest(initialGuest: any = {}) {
    const [guestData, setGuestData] = useState(initialGuest);

    async function refreshGuest() {
        const result = await GuestApiLibrary.getGuest();
        if (result.data) {
            setGuestData(result.data);
        }
    }

    return { guestData, setGuestData, refreshGuest };
}
