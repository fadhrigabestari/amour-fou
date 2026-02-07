import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-rose-50 dark:bg-zinc-900">
      <Header />

      <main>
        <section id="home" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="mb-4 font-serif text-6xl font-bold text-rose-900 dark:text-rose-200 md:text-7xl">
                Adristi & Fadhriga
              </h1>
              <p className="mb-6 text-2xl text-rose-700 dark:text-rose-300">
                We're Getting Married!
              </p>
              <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                Join us as we celebrate our love and commitment on the most special day of our lives.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="rounded-full bg-rose-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                >
                  RSVP Now
                </button>
              </div>
            </div>
            <div className="relative h-96 overflow-hidden rounded-2xl md:h-[500px]">
              <Image
                className="object-cover"
                src="/img/photo1.JPG"
                alt="Muhammad and Sarah"
                fill
                priority
              />
            </div>
          </div>
        </section>

        <section id="pictures" className="bg-white py-20 dark:bg-zinc-800">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-12 text-center font-serif text-4xl font-bold text-rose-900 dark:text-rose-200">
              Our Moments
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image
                  className="object-cover transition-transform hover:scale-110"
                  src="/img/photo1.JPG"
                  alt="Our moment 1"
                  fill
                />
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image
                  className="object-cover transition-transform hover:scale-110"
                  src="/img/photo1.JPG"
                  alt="Our moment 2"
                  fill
                />
              </div>
              <div className="relative h-64 overflow-hidden rounded-lg">
                <Image
                  className="object-cover transition-transform hover:scale-110"
                  src="/img/photo1.JPG"
                  alt="Our moment 3"
                  fill
                />
              </div>
            </div>
          </div>
        </section>

        <section id="details" className="mx-auto max-w-4xl px-6 py-20">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold text-rose-900 dark:text-rose-200">
            Wedding Details
          </h2>
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800 md:p-12">
            <div className="mb-8 text-center">
              <p className="mb-2 text-2xl font-medium text-gray-800 dark:text-gray-200">
                15 June 2026
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The Grand Ballroom, Jakarta
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
        </section>
      </main>
    </div>
  );
}