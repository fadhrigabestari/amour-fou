"use client";

import Image from "next/image";
import Header from "@/components/Header";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [eventProximity, setEventProximity] = useState<number[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetDate = new Date("2026-02-14T15:30:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const centerPosition = scrollLeft + containerWidth / 2;

      const cards = container.querySelectorAll('[data-event-index]');
      const proximityValues: number[] = [];

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = scrollLeft + rect.left + rect.width / 2;
        const distance = Math.abs(centerPosition - cardCenter);
        const maxDistance = containerWidth / 2;
        const proximity = Math.max(0, 1 - distance / maxDistance);
        proximityValues.push(proximity);
      });

      setEventProximity(proximityValues);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleAddToCalendar = () => {
    const event = {
      title: "Adristi & Fadhriga Wedding",
      description: "Join us as we celebrate our love and commitment",
      location: "InterContinental Bandung Dago Pakar, Jl. Resor Dago Pakar Raya No.2B, Bandung",
      startDate: "20260214T153000",
      endDate: "20260214T213000",
    };

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startDate}/${event.endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
  };

  const handleCheckDirection = () => {
    const mapsUrl = "https://www.google.com/maps/place/InterContinental+Bandung+Dago+Pakar+by+IHG/@-6.8667338,107.6397310,17z/data=!3m1!4b1!4m6!3m5!1s0x2e68e715a13ee277:0x5376a74da04505a1!8m2!3d-6.8667391!4d107.6423059!16s%2Fg%2F11c5n5_rn5";
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const timelineEvents = [
    {
      time: "15:30",
      title: "Holy Ceremony",
      description: "The sacred wedding ceremony begins",
    },
    {
      time: "16:00",
      title: "Wedding Vows",
      description: "Exchange of heartfelt promises",
    },
    {
      time: "19:00",
      title: "Wedding Reception",
      description: "Join us for the celebration",
    },
    {
      time: "20:00",
      title: "Dinner",
      description: "Enjoy a delightful feast",
    },
    {
      time: "21:00",
      title: "Wedding Cake & Wishes",
      description: "Cake cutting and sharing wishes",
    },
    {
      time: "21:30",
      title: "Closing",
      description: "Thank you for celebrating with us",
    },
  ];

  return (
    <div className="min-h-screen bg-rose-50 dark:bg-zinc-900">
      <Header />

      <main>
        <section id="home" className="relative h-screen">
          <div className="absolute inset-0">
            <Image
              className="object-cover object-bottom"
              src="/img/prewed/landscape/prewed-7.JPG"
              alt="Adristi and Fadhriga"
              fill
              priority
            />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />

          <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="mb-4 font-serif text-4xl font-bold text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                Adristi & Fadhriga
              </h1>
              <p className="mb-4 font-serif text-xl text-white drop-shadow-lg sm:text-2xl">
                We&apos;re Getting Married!
              </p>
              <p className="mb-4 text-base text-white drop-shadow-lg sm:text-lg">
                Join us as we celebrate our love and commitment on the most special day of our lives.
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              className="h-6 w-6 text-white drop-shadow-lg sm:h-8 sm:w-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>

        <section id="couple" className="bg-[#9CAF88] py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-center font-imperial text-3xl text-white sm:mb-12 sm:text-4xl">
              The Bride & Groom
            </h2>

            <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
              <div className="text-center">
                <div className="relative mx-auto mb-2 h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96">
                  <div className="absolute inset-0 flex items-center justify-center p-6 z-0 sm:p-8">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src="/img/prewed/portrait/prewed-27.JPG"
                        alt="Adristi"
                        fill
                        className="object-cover object-[35%_85%]"
                      />
                    </div>
                  </div>
                  <Image
                    src="/flower-frame.png"
                    alt=""
                    fill
                    className="object-contain scale-115 z-10 relative"
                  />
                </div>
                <h3 className="mb-2 font-imperial text-xl font-bold text-white sm:text-xl">
                  Adristi Naura Syifa
                </h3>
                <p className="text-sm text-gray-700 sm:text-base">
                  The Bride
                </p>
              </div>

              <div className="text-center">
                <div className="relative mx-auto mb-2 h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96">
                  <div className="absolute inset-0 flex items-center justify-center p-6 z-0 sm:p-8">
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      <Image
                        src="/img/prewed/portrait/prewed-2.JPG"
                        alt="Fadhriga"
                        fill
                        className="object-cover object-bottom scale-180"
                      />
                    </div>
                  </div>
                  <Image
                    src="/flower-frame.png"
                    alt=""
                    fill
                    className="object-contain scale-115 z-10 relative"
                  />
                </div>
                <h3 className="mb-2 font-imperial text-xl font-bold text-white sm:text-xl">
                  Muhammad Fadhriga Bestari
                </h3>
                <p className="text-sm text-gray-700 sm:text-base">
                  The Groom
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="details" className="bg-[#9CAF88] py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-4 text-center font-imperial text-3xl text-white sm:mb-6 sm:text-4xl">
              Wedding Details
            </h2>

            <div className="mb-4 relative flex items-center justify-center sm:mb-6">
              <div className="relative w-screen max-w-none aspect-square sm:max-w-3xl md:max-w-4xl">
                <Image
                  src="/flower-circle.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-16 sm:p-32 md:p-40 lg:p-52">
                  <p className="mb-2 font-imperial text-lg text-white sm:mb-3 sm:text-xl md:mb-4 md:text-2xl">
                    InterContinental Bandung
                  </p>

                  <p className="mb-4 font-imperial text-lg text-white sm:mb-6 sm:text-xl md:mb-8 md:text-2xl">
                    14 . 02 . 2026
                  </p>
                  
                  <div className="mb-3 flex items-center justify-center gap-3 text-2xl text-white sm:mb-4 sm:gap-4 sm:text-3xl md:gap-6 md:text-4xl lg:text-5xl">
                    <span className="font-serif">{timeLeft.days}</span>
                    <span className="text-lg sm:text-xl md:text-2xl">:</span>
                    <span className="font-serif">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-lg sm:text-xl md:text-2xl">:</span>
                    <span className="font-serif">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-lg sm:text-xl md:text-2xl">:</span>
                    <span className="font-serif">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                  
                  <div className="mb-4 flex justify-center gap-4 text-xs text-white sm:mb-6 sm:gap-6 sm:text-sm md:mb-8 md:gap-8">
                    <span>Days</span>
                    <span>Hours</span>
                    <span>Minutes</span>
                    <span>Seconds</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={handleAddToCalendar}
                      className="rounded-full bg-[#2D5016] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3D6820] sm:px-5 sm:py-3 sm:text-sm md:px-6 md:text-base"
                    >
                      Add to Calendar
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckDirection}
                      className="rounded-full bg-[#2D5016] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3D6820] sm:px-5 sm:py-3 sm:text-sm md:px-6 md:text-base"
                    >
                      Check Direction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="timeline" className="bg-[#9CAF88] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="mb-16 text-center font-imperial text-3xl text-white sm:mb-20 sm:text-4xl">
              Wedding Timeline
            </h2>

            <div className="relative mb-12">
              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto pb-8 scrollbar-hide scroll-smooth"
              >
                <div className="relative inline-flex items-center px-4 min-w-max">
                  <div className="h-1 bg-white absolute left-0 right-0 top-1/2 -translate-y-1/2"></div>

                  {timelineEvents.map((event, index) => {
                    const proximity = eventProximity[index] || 0;
                    const scale = 0.7 + 0.3 * proximity;
                    const opacity = 0.5 + 0.5 * proximity;

                    return (
                      <div 
                        key={index} 
                        className="relative flex items-center justify-center mx-24 first:ml-48 last:mr-48"
                      >
                        <div 
                          data-event-index={index}
                          className="w-72 rounded-2xl bg-[#2D5016] border border-white/30 p-6 shadow-lg z-10 transition-all duration-300 ease-out origin-center"
                          style={{
                            transform: `scale(${scale})`,
                            opacity: opacity,
                          }}
                        >
                          <p className="mb-3 text-sm text-white font-semibold">
                            {event.time}
                          </p>
                          <h3 className="mb-2 font-serif text-xl font-bold text-white">
                            {event.title}
                          </h3>
                          <p className="text-sm text-white/90">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}