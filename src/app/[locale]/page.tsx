import Hero from "@/components/hero";
import GithubStats from "@/components/github-stats";
import Projects from "@/components/projects";
import About from "@/components/about";
import Technology from "@/components/technology";
import WakaTimeStats from "@/components/waka-time-stats";
import Contact from "@/components/contact";
import {META} from "@/config/settings";

export default function HomePage() {
    return (
        <>
            <Hero/>
            <GithubStats username={META.profiles.github} />
            <div className="h-4"/>
            <div id={"readmore"}/>
            <About/>
            <div className="h-16"/>
            <Projects count={3}/>
            <div className="h-16"/>
            <WakaTimeStats/>
            <div className="h-16"/>
            <Technology/>
            <div className="h-16"/>
            <Contact/>
        </>
    );
}