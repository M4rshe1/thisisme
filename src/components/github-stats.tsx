import {FolderOpen, GitCommit, Star, Users,} from 'lucide-react';
import {humanReadable} from "@/lib/utils";
import {Link} from "@/i18n/navigation";

// Define the shape of the data we expect from the API
interface GithubStatsData {
    public_repos: number;
    followers: number;
    total_private_repos?: number; // Optional, depending on your token scope
    total_contributions?: number; // Using total contributions as a proxy for commits
    starred_repos?: number;
}

async function getUserData(username: string): Promise<GithubStatsData | null> {
    "use cache";
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        console.error('GITHUB_TOKEN is not set');
        return null;
    }

    try {
        // Fetch user data using the REST API
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                Authorization: `token ${token}`,
            },
            // Next.js specific: Cache the data for a bit
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        if (!userRes.ok) {
            console.error(`Error fetching user data: ${userRes.statusText}`);
            return null;
        }

        const userData = await userRes.json();

        // Fetch starred repos count (requires separate endpoint)
        const starredRes = await fetch(
            `https://api.github.com/users/${username}/starred?per_page=1`,
            {
                headers: {
                    Authorization: `token ${token}`,
                },
                next: { revalidate: 3600 }, // Revalidate every hour
            },
        );

        let starredCount = 0;
        if (starredRes.ok) {
            const linkHeader = starredRes.headers.get('link');
            if (linkHeader) {
                const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
                if (lastPageMatch && lastPageMatch[1]) {
                    starredCount = parseInt(lastPageMatch[1], 10);
                }
            } else {
                console.warn(
                    "Could not determine total starred repo count from 'Link' header.",
                );
            }
        } else {
            console.error(`Error fetching starred repos: ${starredRes.statusText}`);
        }

        // --- Fetch total contributions using GraphQL in batches ---
        const graphqlEndpoint = 'https://api.github.com/graphql';
        const graphqlQuery = `
            query($username: String!, $from: DateTime, $to: DateTime) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                        totalContributions
                    }
                }
              }
            }
        `;

        let totalContributions = 0;
        const startYear = 2020; // Starting year for fetching contributions
        const currentYear = new Date().getFullYear();

        for (let year = startYear; year <= currentYear; year++) {
            const fromDate = new Date(`${year}-01-01T00:00:00Z`).toISOString();
            const toDate = new Date(`${year}-12-31T23:59:59Z`).toISOString();

            // Adjust the 'to' date for the current year to not exceed the current date
            const now = new Date();
            const currentYearEndDate = new Date(`${currentYear}-12-31T23:59:59Z`);
            const effectiveToDate = year === currentYear && now < currentYearEndDate ? now.toISOString() : toDate;


            // console.log(`Fetching contributions for ${year}: from ${fromDate} to ${effectiveToDate}`);

            const graphqlRes = await fetch(graphqlEndpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: graphqlQuery,
                    variables: {
                        username,
                        from: fromDate,
                        to: effectiveToDate,
                    },
                }),
                next: { revalidate: 3600 }, // Cache for an hour
            });

            if (graphqlRes.ok) {
                const graphqlData = await graphqlRes.json();
                if (
                    graphqlData.data &&
                    graphqlData.data.user &&
                    graphqlData.data.user.contributionsCollection &&
                    graphqlData.data.user.contributionsCollection.contributionCalendar
                ) {
                    totalContributions +=
                        graphqlData.data.user.contributionsCollection.contributionCalendar
                            .totalContributions;
                } else {
                    console.error(
                        `Could not extract total contributions from GraphQL response for year ${year}.`,
                    );
                    console.error('GraphQL Data:', graphqlData); // Log the full data for debugging
                }
            } else {
                console.error(
                    `Error fetching GraphQL data for year ${year}: ${graphqlRes.statusText}`,
                );
                // Log the response body for more details on the error
                const errorBody = await graphqlRes.text();
                console.error('GraphQL Error Response Body:', errorBody);
                break; // Stop fetching batches if there's an error
            }
        }
        // --- End of GraphQL Fetch ---

        return {
            public_repos: userData.public_repos,
            followers: userData.followers,
            starred_repos: starredCount,
            total_contributions: totalContributions, // Sum of contributions from all years
        };
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}



interface GithubStatsProps {
    username: string;
}

export default async function GithubStats({username}: GithubStatsProps) {
    const stats = await getUserData(username);

    if (!stats) {
        return <div>Error loading GitHub stats.</div>;
    }

    return (
        <div
            className="md:flex md:flex-row grid grid-cols-2 justify-between items-center rounded-md p-4 text-gray-400 text-sm">
            <Link
                href={`https://github.com/${username}?tab=repositories`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <FolderOpen className="w-5 h-5"/>
                <span className="font-bold">{
                    humanReadable(stats.public_repos)
                }</span>
                <span>Repos</span>
            </Link>

            <Link
                href={`https://github.com/${username}?tab=stars`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <Star className="w-5 h-5"/>
                <span className="font-bold">{
                    humanReadable(stats.starred_repos || 0)
                }</span>
                <span>Stars</span>
            </Link>

            <Link
                href={`https://github.com/${username}?tab=followers`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <Users className="w-5 h-5"/>
                <span className="font-bold">{
                    humanReadable(stats.followers)
                }</span>
                <span>Followers</span>
            </Link>

            <Link
                href={`https://github.com/${username}`}

                className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <GitCommit className="w-5 h-5"/>
                <span className="font-bold">{
                    humanReadable(stats.total_contributions || 0, 1)
                }</span>
                <span>Commits</span>
            </Link>
        </div>
    );
}
