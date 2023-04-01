import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Navbar } from "~/components/Navbar";
import { Feed } from "~/components/Feed";
import { Layout } from "~/components/Layout";

import { useRouter } from "next/router";

const Profile: NextPage = () => {
  const router = useRouter();
  const { query } = router;

  const onGetUserProfileError = () => {
    toast.error("Something went wrong while fetching the user");
  };

  const onGetPostsError = () => {
    toast.error("Something went wrong while fetching the posts");
  };

  const { data: userProfile } = api.users.getUserProfile.useQuery(
    { userId: String(query.profile) },
    { onError: onGetUserProfileError }
  );

  const { data: posts, isLoading: isPostsLoading } = api.posts.getAll.useQuery(
    { userId: String(query.profile) },
    { onError: onGetPostsError }
  );

  return (
    <>
      <Head>
        <title>{userProfile?.userName}</title>
        <meta name="profile" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Navbar />
        <Feed posts={posts || []} isPostsLoading={isPostsLoading} />
      </Layout>
    </>
  );
};

export default Profile;
