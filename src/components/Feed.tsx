import type { Post } from "@prisma/client";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { ProfileImg, ProfileImgPlaceholder } from "./ProfileImage";
import type { FC, PropsWithChildren } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";

const FeedSkeleton = () => {
  return (
    <>
      {[...Array(5).keys()].map((n) => {
        return (
          <div
            key={n}
            className="flex items-center gap-3 border-b border-slate-500 p-4"
          >
            <div className="w-16">
              <ProfileImgPlaceholder animated />
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        );
      })}
    </>
  );
};

const getRelativeTime = (date: Date) => {
  try {
    return formatRelative(new Date(date), new Date());
  } catch (e) {
    return "";
    // TODO: stream log
  }
};

const PostRow = ({ post }: { post: Post }) => {
  const { createdAt, profileImageUrl, userId, userName, description, link } =
    post;
  const relativeTime = getRelativeTime(createdAt);

  return (
    <div className="flex gap-3 border-b border-slate-500 p-4">
      <ProfileImg url={profileImageUrl} loading={false} userId={userId} />

      <div className="flex flex-col gap-2">
        <div>
          <Link href={`${userName}`}>{userName}</Link> ·{" "}
          <span className="font-thin">{relativeTime}</span>
        </div>
        <div>{description}</div>
      </div>

      {link && (
        <div className="ml-auto flex items-center">
          <a
            target="_blank"
            href={link}
            rel="noopener noreferrer"
            className="btn-ghost btn-sm btn-square btn bg-transparent"
          >
            <ArrowTopRightOnSquareIcon className="h-6 w-6 border-slate-500" />
          </a>
        </div>
      )}
    </div>
  );
};

interface PostsListProps {
  posts: Post[];
}

const PostsList: FC<PostsListProps> = ({ posts }) => {
  if (!posts.length) {
    return (
      <div className="flex justify-center p-6">
        So sad around here... Post something to save the day
      </div>
    );
  }

  return (
    <>
      {posts?.map((post) => (
        <PostRow key={post.id} post={post} />
      ))}
    </>
  );
};

const FeedContainer: FC<PropsWithChildren> = ({ children }) => {
  const { isSignedIn } = useUser();

  const heightFromTop = isSignedIn ? "250px" : "70px";
  const className = `max-h-[calc(100%-${heightFromTop})] overflow-auto`;
  return <div className={className}>{children}</div>;
};

interface FeedProps {
  posts: Post[];
  isPostsLoading: boolean;
}

export const Feed: FC<FeedProps> = ({ posts, isPostsLoading }) => {
  return (
    <FeedContainer>
      {isPostsLoading ? <FeedSkeleton /> : <PostsList posts={posts} />}{" "}
    </FeedContainer>
  );
};
