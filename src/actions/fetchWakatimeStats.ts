"use server";

import { META } from "@/config/settings";

const fetchWakatimeStatsAllTime = async () => {
  try {
    const response = await fetch(
      `https://wakatime.com/api/v1/users/${META.profiles.wakatime}/stats/all_time`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Wakatime data");
    }

    const data = await response.json();

    return data.data;
  } catch (err) {
    console.error("Error fetching Wakatime data:", err);
    throw err;
  }
};

// const fetchWakatimeStatsLast7Days = async () => {
//   try {
//     const response = await fetch(
//       `https://wakatime.com/api/v1/users/current/stats/last_7_days`
//     );
//     const data = await response.json();
//     console.log(data);
//     return data.data;
//   } catch (err) {
//     console.error("Error fetching Wakatime data:", err);
//     throw err;
//   }
// };

const fetchWakatimeStats = async () => {
  const allTimeStats = await fetchWakatimeStatsAllTime();
  // const last7DaysStats = await fetchWakatimeStatsLast7Days();

  return { allTimeStats };
};

export { fetchWakatimeStats };
