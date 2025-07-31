"use client";

import { FolderOpen, GitCommit, Star, Users } from "lucide-react";
import { humanReadable } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getUserDataAction } from "@/actions/github";
import { useQuery } from "@tanstack/react-query";

interface GithubStatsProps {
  username: string;
}

export default function GithubStats({ username }: GithubStatsProps) {
  const {
    data: stats,
    isPending,
    error,
  } = useQuery({
    queryKey: ["github-stats", username],
    queryFn: () => getUserDataAction(username),
    staleTime: 1000 * 60 * 60,
  });

  const StatsSkeleton = ({ message }: { message: string }) => (
    <div className="md:flex md:flex-row grid grid-cols-2 justify-between items-center rounded-md p-4 text-gray-400 text-sm">
      <div className="flex items-center space-x-2 mb-2 md:mb-0 opacity-60">
        <FolderOpen className="w-5 h-5 animate-pulse" />
        <span className="font-bold bg-gray-700/40 rounded w-8 h-5 inline-block animate-pulse" />
        <span>Repos</span>
      </div>
      <div className="flex items-center space-x-2 mb-2 md:mb-0 opacity-60">
        <Star className="w-5 h-5 animate-pulse" />
        <span className="font-bold bg-gray-700/40 rounded w-8 h-5 inline-block animate-pulse" />
        <span>Stars</span>
      </div>
      <div className="flex items-center space-x-2 mb-2 md:mb-0 opacity-60">
        <Users className="w-5 h-5 animate-pulse" />
        <span className="font-bold bg-gray-700/40 rounded w-8 h-5 inline-block animate-pulse" />
        <span>Followers</span>
      </div>
      <div className="flex items-center space-x-2 opacity-60">
        <GitCommit className="w-5 h-5 animate-pulse" />
        <span className="font-bold bg-gray-700/40 rounded w-8 h-5 inline-block animate-pulse" />
        <span>Commits</span>
      </div>
    </div>
  );

  if (isPending) {
    return <StatsSkeleton message="Loading..." />;
  }

  if (error) {
    return <StatsSkeleton message={`Error loading stats: ${error.message}`} />;
  }

  if (!stats) {
    return <StatsSkeleton message="No stats found." />;
  }

  return (
    <div className="md:flex md:flex-row grid grid-cols-2 justify-between items-center rounded-md p-4 text-gray-400 text-sm">
      <Link
        href={`https://github.com/${username}?tab=repositories`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200"
      >
        <FolderOpen className="w-5 h-5" />
        <span>{humanReadable(stats.public_repos)}</span>
        <span>Repos</span>
      </Link>
      <Link
        href={`https://github.com/${username}?tab=stars`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200"
      >
        <Star className="w-5 h-5" />
        <span>{humanReadable(stats.starred_repos || 0)}</span>
        <span>Stars</span>
      </Link>

      <Link
        href={`https://github.com/${username}?tab=followers`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200"
      >
        <Users className="w-5 h-5" />
        <span>{humanReadable(stats.followers)}</span>
        <span>Followers</span>
      </Link>

      <Link
        href={`https://github.com/${username}`}
        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200"
      >
        <GitCommit className="w-5 h-5" />
        <span>{humanReadable(stats.total_contributions || 0, 1)}</span>
        <span>Commits</span>
      </Link>
    </div>
  );
}
