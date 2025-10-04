import Hero from "@/components/hero";
import GithubStats from "@/components/github-stats";
import Projects from "@/components/projects";
import About from "@/components/about";
import Technology from "@/components/technology";
import WakaTimeStats from "@/components/waka-time-stats";
import Contact from "@/components/contact";
import { META } from "@/config/settings";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense
        fallback={
          <div
            className={"h-12 flex items-center justify-center text-gray-500"}
          >
            Loading GitHub Stats...
          </div>
        }
      >
        <GithubStats username={META?.socials?.github as string} />
      </Suspense>
      <div className="h-4" />
      <div id={"readmore"} />
      <About />
      <div className="h-16" />
      <Projects count={3} />
      <div className="h-16" />
      <WakaTimeStats />
      <div className="h-16" />
      <Technology />
      <div className="h-16" />
      <Contact />
    </>
  );
}
