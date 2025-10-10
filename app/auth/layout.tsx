import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-background rounded-lg shadow">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
