const WakatimeStats = () => {
    return (
        <div
            className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}
        >
            <div
            className={"w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center"}
            ></div>
            <div
            className={"w-full lg:col-span-2 h-32 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center"}
            ></div>
            <div
            className={"w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg lg:col-span-2 shadow-md flex items-center justify-center"}
            ></div>
            <div
            className={"w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center"}
            ></div>
        </div>
    )
}

export default WakatimeStats;