import {META} from "@/config/settings";

const Logo = () => {
    return (
        <div className="h-9 w-12 overflow-hidden rounded bg-accent flex items-center justify-center">
            <span className={"text-white text-lg font-bold"}>
                {
                    META.name.split(" ").map(word => word.charAt(0).toUpperCase()).join("")
                }
            </span>
            <span className={"bg-primary h-1.5 w-1.5 rounded-full ml-1 mt-2"}/>
        </div>
    );
}

export default Logo;