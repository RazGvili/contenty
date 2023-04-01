import { type NextPage } from "next";
import { CreatePost } from "~/components/CreatePost";
import { Feed } from "~/components/Feed";
import { Layout } from "~/components/Layout";
import { Navbar } from "~/components/Navbar";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: posts, isLoading: isPostsLoading } =
    api.posts.getAll.useQuery();

  return (
    <>
      <Layout>
        <Navbar />
        <CreatePost />
        <Feed posts={posts || []} isPostsLoading={isPostsLoading} />
      </Layout>
    </>
  );
};

export default Home;
