import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";

import { api } from "~/utils/api";
import Image from "next/image";

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
  const { user, isLoaded: isUserLoaded } = useUser();

  if (!isUserLoaded) {
    return <ImagePlaceHolder animated />;
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
        placeholder="Content goes here"
        className="bg-transparent outline-none"
      />
    </div>
  );
};

const Skeleton = () => {
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

const Home: NextPage = () => {
  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser();
  const { data: posts, isLoading: isPostsLoading } =
    api.posts.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Contenty</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-500 md:max-w-2xl">
          <div className="border-b border-slate-500 p-4">
            <div className="flex justify-between">
              <CreatePost />

              <div className="flex items-center">
                {!isUserLoaded && (
                  <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                )}
                {isSignedIn ? (
                  <SignOutButton>
                    <button className="w-20 rounded-full">Sign out</button>
                  </SignOutButton>
                ) : (
                  <SignInButton />
                )}
              </div>
            </div>
          </div>
          {isPostsLoading && <Skeleton />}
          {!isPostsLoading &&
            posts?.map((post) => {
              return (
                <div key={post.id} className="border-b border-slate-500 p-4">
                  {post.content}
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
};

export default Home;
