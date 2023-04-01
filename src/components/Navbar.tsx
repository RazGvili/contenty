import { ProfileImg } from "./ProfileImage";
import { SignInButton, useUser, SignOutButton } from "@clerk/nextjs";
import classNames from "classnames";
import Link from "next/link";

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

  return (
    <div className="navbar border-b border-slate-500">
      <div className="flex-1 items-center">
        <Link href={"/"}>
          <div className="btn-ghost btn text-xl normal-case">Contenty </div>
        </Link>
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
