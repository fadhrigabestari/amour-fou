import Header from "@/components/Header";

export default function Story() {
  return (
    <div className="min-h-screen bg-rose-50 dark:bg-zinc-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="mb-12 text-center font-serif text-5xl font-bold text-rose-900 dark:text-rose-200">
          Our Story
        </h1>
        
        <div className="space-y-12">
          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-rose-900 dark:text-rose-200">
              How We Met
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              We first crossed paths in university during our freshman year. What started as a chance encounter in the library turned into late-night study sessions and coffee dates.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-rose-900 dark:text-rose-200">
              The Proposal
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              After 5 wonderful years together, Muhammad planned a surprise weekend getaway to our favorite beach. Under the stars, he got down on one knee and asked the question that changed our lives forever.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-rose-900 dark:text-rose-200">
              Looking Forward
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              We can't wait to start this new chapter of our lives surrounded by the people we love most. Thank you for being part of our journey.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}