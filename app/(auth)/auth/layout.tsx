import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-dvh flex-col items-center justify-center bg-[#f5f5f7] px-4">
      {children}
    </main>
  );
};

export default AuthLayout;
