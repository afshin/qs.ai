import { PropsWithChildren } from 'react';

const LauncherLayout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="h-[calc(100dvh-4rem)] grid grid-cols-10 gap-0">
      {children}
    </div>
  );
};

export default LauncherLayout;
