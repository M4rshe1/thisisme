import {
    GitCommit,
    Star,
    Users,
    FolderOpen,
} from 'lucide-react';
import {humanReadable} from "@/lib/utils";
import {Link} from "@/i18n/navigation";

// Define the shape of the data we expect from the API
interface GithubStatsData {
    public_repos: number;
    followers: number;
    total_private_repos?: number; // Optional, depending on your token scope
    total_commits?: number; // We'll calculate this separately or fetch from another endpoint
    starred_repos?: number; // We'll fetch this separately
}

// Function to fetch user data
async function getUserData(username: string): Promise<GithubStatsData | null> {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        console.error('GITHUB_TOKEN is not set');
        return null;
    }

    try {
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
        const starredRes = await fetch(`https://api.github.com/users/${username}/starred?per_page=1`, {
            headers: {
                Authorization: `token ${token}`,
            },
            next: { revalidate: 3600 }, // Revalidate every hour
        });

        let starredCount = 0;
        if(starredRes.ok) {
            // Get the total count from the 'Link' header if available
            const linkHeader = starredRes.headers.get('link');
            if (linkHeader) {
                const lastPageMatch = linkHeader.match(/&page=(\d+)>; rel="last"/);
                if (lastPageMatch && lastPageMatch[1]) {
                    starredCount = parseInt(lastPageMatch[1], 10);
                }
            } else {
                // If no 'Link' header (user has no starred repos or very few),
                // we can't get a reliable count without fetching all pages.
                // For simplicity, we'll just set it to 0 if no header.
                // A more robust solution would involve iterating through pages.
                console.warn("Could not determine total starred repo count from 'Link' header.");
            }
        } else {
            console.error(`Error fetching starred repos: ${starredRes.statusText}`);
        }

        // Fetch total commits (This is complex and often requires fetching
        // commits for each repository. A simpler approach for a quick stat
        // is to use a third-party service or a more complex API query.
        // For this example, we'll omit total commits or make an assumption).
        // A very basic (and often inaccurate) estimate could be summing contributions,
        // but the API doesn't provide a simple "total commits across all repos" endpoint.
        // You might need to use a different method or library for accurate total commits.
        // For demonstration purposes, we'll just show other stats.

        return {
            public_repos: userData.public_repos,
            followers: userData.followers,
            starred_repos: starredCount,
            total_commits: 0,
        };

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

interface GithubStatsProps {
    username: string;
}

export default async function GithubStats({ username }: GithubStatsProps) {
    const stats = await getUserData(username);

    if (!stats) {
        return <div>Error loading GitHub stats.</div>;
    }

    return (
        <div className="mg:flex md:flex-row grid grid-cols-2 justify-between items-center rounded-md p-4 text-gray-400 text-sm">
            <Link
                href={`https://github.com/${username}?tab=repositories`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <FolderOpen className="w-5 h-5" />
                <span className="font-bold">{
                    humanReadable(stats.public_repos)
                }</span>
                <span>Repos</span>
            </Link>

            <Link
                href={`https://github.com/${username}?tab=stars`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <Star className="w-5 h-5" />
                <span className="font-bold">{
                    humanReadable(stats.starred_repos || 0)
                }</span>
                <span>Stars</span>
            </Link>

            <Link
                href={`https://github.com/${username}?tab=followers`}
                className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <Users className="w-5 h-5" />
                <span className="font-bold">{
                    humanReadable(stats.followers)
                }</span>
                <span>Followers</span>
            </Link>

            <Link
                href={`https://github.com/${username}`}

                className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 hover:underline">
                <GitCommit className="w-5 h-5" />
                <span className="font-bold">{
                    humanReadable(stats.total_commits || 0)
                }</span>
                <span>Commits</span>
            </Link>
        </div>
    );
}
