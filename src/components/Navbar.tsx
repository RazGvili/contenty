import { ProfileImg } from "./ProfileImage";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import classNames from "classnames";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const AuthButton = () => {
  const { isSignedIn } = useUser();

  const signButtonStyles = classNames({
    btn: true,
    "btn-xs": true,
    "btn-ghost": true,
  });

  return (
    <div>
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
  );
};

export const Navbar = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const { query } = router;

  const { data: userProfile } = api.users.getUserProfile.useQuery(
    {
      userId: String(query.profile),
    },
    { enabled: Boolean(query?.profile) }
  );

  return (
    <div className="navbar border-b border-slate-500">
      <div className="flex-1 items-center gap-1">
        <Link href={"/"}>
          <div className="btn-ghost btn text-xl normal-case">Contenty </div>
        </Link>
        {userProfile?.userName && (
          <span className="flex h-full items-center">{`| ${userProfile.userName}`}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <AuthButton />
        <ProfileImg
          url={user?.profileImageUrl || ""}
          loading={!isUserLoaded}
          userId={user?.id || ""}
        />
      </div>
    </div>
  );
};
