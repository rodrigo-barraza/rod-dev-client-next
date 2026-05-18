import type { Metadata } from 'next';
import ClientHome from './ClientHome';

export const metadata: Metadata = {
    title: 'Rodrigo Barraza: Photographer, Software Engineer, Artist',
    description: 'Visual portfolio of Rodrigo Barraza, a Vancouver-based photographer, software engineer and generative AI artist. Featuring photography, AI art, film, and animation collections.',
    keywords: 'rodrigo barraza, photographer, software engineer, artist, vancouver, generative ai art, clip guided diffusion, film photography, medium format photography, ai artist, portfolio, emily carr university',
    openGraph: {
        images: ['https://assets.rod.dev/rod-dev-assets/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg'],
    }
    // We can omit JSON-LD for now or just add it as a script tag in layout later
};

export default function Page() {
    return <ClientHome />;
}
