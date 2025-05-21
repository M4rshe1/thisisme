"use server"


import {META} from "@/config/settings";

const fetchWakatimeStats = async () => {
    "use cache";

    try {
        const response = await fetch(
            `https://wakatime.com/api/v1/users/${META.profiles.wakatime}/stats/all_time`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Wakatime data');
        }

        const data = await response.json();

        return data.data;
    } catch (err) {
        console.error('Error fetching Wakatime data:', err);
        throw err;
    }
};

export {fetchWakatimeStats};
export default fetchWakatimeStats;