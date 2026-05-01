import { useRouter } from 'next/router';

const collections = () => {
    const router = useRouter();

    // Redirect to home — /collections has no standalone content
    if (typeof window !== 'undefined') {
        router.replace('/');
    }

    return null;
}

export default collections