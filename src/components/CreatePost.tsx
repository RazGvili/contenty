import { useState } from "react";
import { toast } from "react-hot-toast";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import classNames from "classnames";

export const CreatePost = () => {
  const ctx = api.useContext();

  const { isSignedIn } = useUser();
  const [input, setInput] = useState("");

  const onPostSuccesses = async () => {
    setInput("");
    await ctx.posts.invalidate();
    toast("Good Job!", {
      icon: "👏",
    });
  };

  const onPostError = (e: TRPCClientErrorLike<AppRouter>) => {
    // TODO: ship error logs
    toast.error("Oops something went wrong. try posting again later");
  };

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: onPostSuccesses,
    onError: (e) => onPostError(e),
  });

  const onPost = () => {
    mutate({ content: input });
  };

  const isEmpty = input === "";

  if (!isSignedIn) {
    return <div className="w-full" />;
  }

  return (
    <div className="border-b border-slate-500 p-4">
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-3">
          {/* TODO: use form lib */}
          <input
            value={input}
            placeholder="Only fantastic content goes here"
            className="w-full bg-transparent  outline-none"
            onChange={(e) => setInput(e.target.value)}
            disabled={isPosting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isEmpty) {
                onPost();
              }
            }}
          />

          <button
            onClick={onPost}
            disabled={isPosting || isEmpty}
            className={classNames({
              "opacity-0": isEmpty,
              "opacity-100": !isEmpty,
              btn: true,
              "btn-sm": true,
              glass: true,
              loading: isPosting,
            })}
          >
            {isPosting ? "Loading..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};
