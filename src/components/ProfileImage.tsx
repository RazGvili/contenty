import Image from "next/image";
import Link from "next/link";

export const ProfileImgPlaceholder = ({ animated }: { animated?: boolean }) => {
  return (
    <div
      className={`h-16 w-16 ${
        animated ? "animate-pulse" : ""
      } rounded-full bg-slate-700`}
    />
  );
};

interface ProfileImgProps {
  url: string;
  loading: boolean;
  userId: string;
}

export const ProfileImg = ({ url, loading, userId }: ProfileImgProps) => {
  if (loading) {
    return <ProfileImgPlaceholder animated />;
  }

  if (!url || !userId) {
    return null;
  }

  return (
    <Link href={userId}>
      <Image
        src={url}
        alt="profile image"
        loading="lazy"
        className="btn-ghost btn-circle avatar btn h-14 w-14 rounded-full"
        width={48}
        height={48}
      />
    </Link>
  );
};
