import Hero from "@/components/hero";
import GithubStats from "@/components/github-stats";
import RecentProjects from "@/components/recent-projects";
import About from "@/components/about";
import Technology from "@/components/technology";
import WakaTimeStats from "@/components/waka-time-stats";
import Contact from "@/components/contact";

export default function HomePage() {
    return (
        <>
            <Hero/>
            <GithubStats username={"m4rshe1"}/>
            <div className="h-4"/>
            <div id={"readmore"}/>
            <About/>
            <div className="h-16"/>
            <RecentProjects/>
            <div className="h-16"/>
            <WakaTimeStats/>
            <div className="h-16"/>
            <Technology/>
            <div className="h-16"/>
            <Contact/>
        </>
    );
}