import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gym Tracker",
  description: "Gym exercise tracking and journal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
