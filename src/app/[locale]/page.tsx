import Hero from "@/components/hero";
import GithubStats from "@/components/github-stats";
import RecentProjects from "@/components/recent-projects";
import About from "@/components/about";
import Technology from "@/components/technology";
import WakatimeStats from "@/components/wakatime-stats";

export default function HomePage() {
    return (
        <>
            <Hero/>
            <GithubStats username={"m4rshe1"}/>
            <div id={"readmore"}/>
            <About/>
            <RecentProjects/>
            <WakatimeStats/>
            <Technology/>
        </>
    );
}