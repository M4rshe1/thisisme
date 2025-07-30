"use client";

import { FolderOpen, GitCommit, Star, Users } from "lucide-react";
import { humanReadable } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { getUserDataAction } from "@/actions/github";
import { useQuery } from "@tanstack/react-query";

// Define the shape of the data we expect from the API

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

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-black/30 p-8">
          <p className="text-lg text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-black/30 p-8">
          <p className="text-lg text-gray-300">
            Error loading stats: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-black/30 p-8">
          <p className="text-lg text-gray-300">No stats found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:flex md:flex-row grid grid-cols-2 justify-between items-center rounded-md p-4 text-gray-400 text-sm">
      <Link
        href={`https://github.com/${username}?tab=repositories`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 font-bold"
      >
        <FolderOpen className="w-5 h-5" />
        <span className="font-bold">{humanReadable(stats.public_repos)}</span>
        <span>Repos</span>
      </Link>

      <Link
        href={`https://github.com/${username}?tab=stars`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 font-bold"
      >
        <Star className="w-5 h-5" />
        <span className="font-bold">
          {humanReadable(stats.starred_repos || 0)}
        </span>
        <span>Stars</span>
      </Link>

      <Link
        href={`https://github.com/${username}?tab=followers`}
        className="flex items-center space-x-2 mb-2 md:mb-0 hover:text-gray-200 transition-colors duration-200 font-bold"
      >
        <Users className="w-5 h-5" />
        <span className="font-bold">{humanReadable(stats.followers)}</span>
        <span>Followers</span>
      </Link>

      <Link
        href={`https://github.com/${username}`}
        className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 font-bold"
      >
        <GitCommit className="w-5 h-5" />
        <span className="font-bold">
          {humanReadable(stats.total_contributions || 0, 1)}
        </span>
        <span>Commits</span>
      </Link>
    </div>
  );
}
