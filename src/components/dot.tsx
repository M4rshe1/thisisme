import {cn} from "@/lib/utils";

const Dot = ({className}:{className?: string}) => {
    return <div className={cn("inline-block bg-primary h-1.5 w-1.5 rounded-full", className)}/>}

export default Dot