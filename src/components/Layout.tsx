import type { FC, PropsWithChildren } from "react";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex h-screen justify-center">
      <div className="h-full w-full border-x border-slate-500 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
};
