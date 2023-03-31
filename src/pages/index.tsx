import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

const ImagePlaceHolder = ({ animated }: { animated?: boolean }) => {
  return (
    <div
      className={`h-16 w-16 ${
        animated ? "animate-pulse" : ""
      } rounded-full bg-slate-700`}
    />
  );
};

const CreatePost = () => {
  const ctx = api.useContext();

  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const [input, setInput] = useState("");

  const onPostSuccesses = async () => {
    setInput("");
    await ctx.posts.invalidate();
    toast("Good Job!", {
      icon: "👏",
    });
  };

  const onPostError = (e: TRPCClientErrorLike<AppRouter>) => {
    console.log("e:", e);
    toast.error("Oops something went wrong. try posting again later");
  };

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: onPostSuccesses,
    onError: (e) => onPostError(e),
  });

  const onPost = () => {
    mutate({ content: input });
  };

  if (!isUserLoaded) {
    return <ImagePlaceHolder animated />;
  }

  if (!isSignedIn) {
    return <div className="w-full" />;
  }

  return (
    <div className="flex w-full gap-3">
      {user?.profileImageUrl ? (
        <Image
          src={user.profileImageUrl}
          alt="profile image"
          loading="lazy"
          className="h-16 w-16 rounded-full"
          width={56}
          height={56}
        />
      ) : (
        <ImagePlaceHolder />
      )}

      <input
        value={input}
        placeholder="Content goes here"
        className="bg-transparent outline-none"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />

      <button onClick={onPost} disabled={isPosting}>
        {isPosting ? "Loading..." : "Post"}
      </button>
    </div>
  );
};

const FeedSkeleton = () => {
  return (
    <>
      {[...Array(10).keys()].map((n) => {
        return (
          <div
            key={n}
            className="flex items-center justify-center border-b border-slate-500 p-4"
          >
            <div className="h-4 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        );
      })}
    </>
  );
};

const Feed = () => {
  const { data: posts, isLoading: isPostsLoading } =
    api.posts.getAll.useQuery();

  if (isPostsLoading) {
    return <FeedSkeleton />;
  }

  return (
    <div>
      {posts?.map((post) => {
        return (
          <div key={post.id} className="border-b border-slate-500 p-4">
            {post.content}
          </div>
        );
      })}
    </div>
  );
};

const signButtonStyles =
  "w-20 rounded-full border border-solid border-slate-500	 p-2 text-slate-500 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110";

const Header = () => {
  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser();

  return (
    <div className="border-b border-slate-500 p-4">
      <div className="flex items-center justify-between">
        <CreatePost />

        <div className="flex items-center">
          {!isUserLoaded && !isSignedIn && (
            <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          {isSignedIn ? (
            <SignOutButton>
              <button className={signButtonStyles}>Sign out</button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <button className={signButtonStyles}>Sign in</button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contenty</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-500 md:max-w-2xl">
          <Header />
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
