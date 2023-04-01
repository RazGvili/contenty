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
  const [link, setLink] = useState("");

  const onPostSuccesses = async () => {
    setInput("");
    setLink("");
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
    mutate({ description: input, link });
  };

  const isEmpty = input === "";
  const isMaxLen = input.length >= 100;

  if (!isSignedIn) {
    return <div className="w-full" />;
  }

  return (
    <div className="flex justify-center border-b-2 border-slate-500 p-2 pt-4">
      <div className=" w-full  max-w-[500px]">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-3">
            <div className="form-control w-full ">
              <input
                autoFocus
                value={input}
                placeholder="Enter a cool book/video/course/other"
                className={classNames({
                  input: true,
                  "input-bordered": true,
                  "input-sm": true,
                  "w-full": true,
                  "bg-transparent": true,
                  "input-error": isMaxLen,
                })}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isEmpty) {
                    onPost();
                  }
                }}
              />
              {isMaxLen && (
                <label className="label">
                  <span className="label-text-alt">Max of 100 characters</span>
                </label>
              )}
            </div>

            <input
              value={link}
              placeholder="Paste link (optional)"
              className={classNames({
                input: true,
                "input-bordered": true,
                "input-sm": true,
                "w-full": true,
                "bg-transparent": true,
              })}
              onChange={(e) => setLink(e.target.value)}
              disabled={isPosting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isEmpty) {
                  onPost();
                }
              }}
            />
            <div className="flex justify-center">
              <div
                className={classNames({
                  collapse: true,
                  "collapse-open": !isEmpty,
                })}
              >
                <div className="collapse-content">
                  <button
                    onClick={onPost}
                    disabled={isPosting}
                    className={classNames({
                      "w-40": true,
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
          </div>
        </div>
      </div>
    </div>
  );
};
