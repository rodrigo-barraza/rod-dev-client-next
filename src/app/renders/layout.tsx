import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rodrigo Barraza - Your AI Renders',
  description: 'View your collection of AI-generated images created with Rodrigo Barraza',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
