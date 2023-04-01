import type { Post } from "@prisma/client";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { ProfileImg, ProfileImgPlaceholder } from "./ProfileImage";
import type { FC, PropsWithChildren } from "react";

const FeedSkeleton = () => {
  return (
    <>
      {[...Array(4).keys()].map((n) => {
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
  const { createdAt } = post;
  const relativeTime = getRelativeTime(createdAt);

  return (
    <div className="flex gap-3 border-b border-slate-500 p-4">
      <ProfileImg
        url={post.profileImageUrl}
        loading={false}
        userId={post.userId}
      />

      <div className="flex flex-col gap-2">
        <div>
          <Link href={`${post.userName}`}>{post.userName}</Link> ·{" "}
          <span className="font-thin">{relativeTime}</span>
        </div>
        <div>{post.content}</div>
      </div>
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
  return (
    <div className="max-h-[calc(100%-200px)] overflow-auto">{children}</div>
  );
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
