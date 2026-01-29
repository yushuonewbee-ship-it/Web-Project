import Hero from '../sections/Hero';
import Features from '../sections/Features';
import Resources from '../sections/Resources';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Resources />
    </main>
  );
}
