import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md text-center px-6">
        <h1 className="text-2xl font-semibold text-gray-900">BuzraReviews</h1>
        <p className="mt-3 text-gray-600">
          Automated Google review requests and AI-drafted replies for
          single-location local businesses.
        </p>
        <Link
          href="/onboarding"
          className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-2.5 text-white"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
