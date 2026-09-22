import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us" };

export default function Page() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Page: about</h1>
    </main>
  );
}
