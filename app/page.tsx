import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Record from "@/components/sections/Record";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <Work />
        <Stack />
        <Record />
        <About />
      </main>
      <Contact />
    </>
  );
}
