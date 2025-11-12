"use client";

import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Just clIEmbing it 🧗
            </h1>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}

