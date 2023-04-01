import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";

// TODO: necessary?
const Profile: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contenty</title>
        <meta name="description" content="TBD" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-500 md:max-w-2xl"></div>
      </main>
    </>
  );
};

export default Profile;
