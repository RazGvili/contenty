import type { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full overflow-hidden border-slate-500 min-[640px]:border-x md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};
