import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rodrigo Barraza - Your Liked AI Art",
  description: "Browse your liked AI-generated images from Rodrigo Barraza",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
