import Header from "@/components/Header";

export default function Details() {
  return (
    <div className="min-h-screen bg-rose-50 dark:bg-zinc-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="mb-12 text-center font-serif text-5xl font-bold text-rose-900 dark:text-rose-200">
          Wedding Details
        </h1>

        <div className="space-y-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-4 font-serif text-3xl font-semibold text-rose-900 dark:text-rose-200">
                Date & Venue
              </h2>
              <p className="mb-2 text-2xl font-medium text-gray-800 dark:text-gray-200">
                15 June 2026
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The Grand Ballroom, Jakarta
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Jl. Sudirman No. 123, Jakarta Pusat
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-rose-50 p-6 dark:bg-zinc-700">
                <h3 className="mb-2 text-xl font-semibold text-rose-900 dark:text-rose-200">
                  Ceremony
                </h3>
                <p className="text-gray-700 dark:text-gray-300">2:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Followed by reception
                </p>
              </div>
              <div className="rounded-lg bg-rose-50 p-6 dark:bg-zinc-700">
                <h3 className="mb-2 text-xl font-semibold text-rose-900 dark:text-rose-200">
                  Dress Code
                </h3>
                <p className="text-gray-700 dark:text-gray-300">Formal Attire</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Black tie optional
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-rose-900 dark:text-rose-200">
              Accommodations
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We have reserved a block of rooms at the Grand Hotel Jakarta for our out-of-town guests.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Use code: WEDDING2026 when booking
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}