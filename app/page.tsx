"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type Answers = {
  treatment: string;
  timeline: string;
  travel: string;
  payment: string;
};

const questions = [
  {
    key: "treatment",
    title: "Which treatment are you most interested in?",
    options: [
      "Express Smile — $3,000",
      "Porcelain Smile — $5,000",
      "Dental Implants — from $2,500",
      "I need help choosing",
    ],
  },
  {
    key: "timeline",
    title: "When would you ideally like to begin treatment?",
    options: [
      "As soon as possible",
      "Within 30 days",
      "Within one to three months",
      "More than three months from now",
      "I am only researching",
    ],
  },
  {
    key: "travel",
    title: "Treatment takes place in Miami. Are you able to travel to Miami?",
    options: [
      "Yes",
      "Yes, depending on scheduling",
      "I need more information about travel",
      "No",
    ],
  },
  {
    key: "payment",
    title: "How would you prefer to pay for treatment?",
    options: [
      "Financing",
      "Credit or debit card",
      "Savings or cash",
      "I would like to discuss my options",
      "I am not financially ready",
    ],
  },
] as const;

const blankAnswers: Answers = {
  treatment: "",
  timeline: "",
  travel: "",
  payment: "",
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(blankAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const result = useMemo(() => {
    const canTravel =
      answers.travel === "Yes" ||
      answers.travel === "Yes, depending on scheduling";
    const soon = [
      "As soon as possible",
      "Within 30 days",
      "Within one to three months",
    ].includes(answers.timeline);
    const payment = [
      "Financing",
      "Credit or debit card",
      "Savings or cash",
      "I would like to discuss my options",
    ].includes(answers.payment);

    if (answers.travel === "No") {
      return {
        name: "Currently Unqualified",
        qualified: false,
        reason: "This lead cannot currently travel to Miami for treatment.",
      };
    }

    if (canTravel && soon && payment) {
      return {
        name: "Qualified Lead",
        qualified: true,
        reason:
          "Can travel to Miami, wants treatment within 90 days, and has a viable payment path.",
      };
    }

    if (canTravel && (soon || payment)) {
      return {
        name: "Sales Review",
        qualified: false,
        reason:
          "Shows meaningful intent but needs additional sales qualification.",
      };
    }

    return {
      name: "Nurture Lead",
      qualified: false,
      reason:
        "Submitted valid information but is not ready for immediate treatment.",
    };
  }, [answers]);

  const choose = (value: string) => {
    const question = questions[step];
    setAnswers((current) => ({ ...current, [question.key]: value }));

    setTimeout(() => {
      if (step < questions.length - 1) setStep((current) => current + 1);
      else setStep(questions.length);
    }, 150);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAnswers(blankAnswers);
    setStep(0);
    setStarted(true);
    setSubmitted(false);
    setShowEvents(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black px-5 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={210}
            height={90}
            className="mx-auto mb-8 h-auto w-44 object-contain"
            priority
          />

          <section className="overflow-hidden rounded-[2rem] border border-[#d6b968]/40 bg-[#111]">
            <div className="border-b border-white/10 p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
                Demonstration result
              </p>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                {result.name}
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/65">
                {result.reason}
              </p>
            </div>

            <div className="grid gap-5 p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-3xl bg-white p-6 text-black">
                <h2 className="text-xl font-semibold">Answers captured</h2>
                <div className="mt-5 space-y-4 text-sm">
                  {Object.entries(answers).map(([key, value]) => (
                    <div key={key} className="border-b border-black/10 pb-3">
                      <p className="capitalize text-black/45">{key}</p>
                      <p className="mt-1 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold">
                  Proposed conversion logic
                </h2>
                <p className="mt-4 leading-7 text-white/60">
                  Every valid submission becomes a standard lead. The stronger
                  qualified-lead signal is only sent when the visitor can
                  travel to Miami, wants treatment within 90 days, and has a
                  viable payment path.
                </p>
                <button
                  onClick={() => setShowEvents((value) => !value)}
                  className="mt-6 w-full rounded-full bg-[#d6b968] px-5 py-3 font-bold text-black"
                >
                  {showEvents ? "Hide event map" : "Show event map"}
                </button>
              </div>
            </div>

            {showEvents && (
              <div className="border-t border-white/10 p-8 md:p-10">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Meta", "Lead", "QualifiedLead"],
                    ["TikTok", "SubmitForm", "QualifiedLead"],
                    ["Google", "generate_lead", "qualified_lead"],
                  ].map(([platform, lead, qualified]) => (
                    <div
                      key={platform}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h3 className="text-xl font-semibold">{platform}</h3>
                      <p className="mt-4 text-sm">✓ {lead}</p>
                      <p
                        className={`mt-2 text-sm ${
                          result.qualified
                            ? "text-[#d6b968]"
                            : "text-white/35"
                        }`}
                      >
                        {result.qualified ? "✓" : "—"} {qualified}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 p-8 md:p-10">
              <button
                onClick={restart}
                className="rounded-full bg-[#d6b968] px-7 py-4 font-bold text-black"
              >
                Run another lead scenario
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f4efe4] text-[#111]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 px-5 py-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={180}
            height={70}
            className="h-auto w-36 object-contain"
            priority
          />
          <button
            onClick={() => {
              setStarted(true);
              setTimeout(
                () =>
                  document
                    .getElementById("quiz")
                    ?.scrollIntoView({ behavior: "smooth" }),
                50
              );
            }}
            className="rounded-full bg-[#d6b968] px-5 py-2.5 text-sm font-bold text-black"
          >
            Check My Options
          </button>
        </div>
      </header>

      <section className="bg-black px-5 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
              Aria Smile Design · Miami
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.04] md:text-7xl">
              Find the right treatment for your new smile.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Answer a few quick questions to explore your treatment options.
              Patients from across the country visit Aria Smile Design in
              Miami.
            </p>
            <button
              onClick={() => {
                setStarted(true);
                setTimeout(
                  () =>
                    document
                      .getElementById("quiz")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  50
                );
              }}
              className="mt-8 rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black"
            >
              Check My Options
            </button>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/50">
              <span>✓ About 60 seconds</span>
              <span>✓ Nationwide patients welcome</span>
              <span>✓ Financing options available</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#d6b968]/30 bg-[#111] p-3">
            <Image
              src="/images/aria-before-after.png"
              alt="Aria Smile Design before and after transformations"
              width={1000}
              height={800}
              className="h-auto w-full rounded-[1.4rem]"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
            Treatment options
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            A clear starting point for every smile.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Express Smile", "$3,000"],
              ["Porcelain Smile", "$5,000"],
              ["Dental Implants", "From $2,500"],
            ].map(([title, price]) => (
              <article
                key={title}
                className="rounded-[1.7rem] border border-black/10 bg-white p-7"
              >
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8d7229]">
                  {price}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-black/60">
                  Explore treatment suitability, timing, payment options, and
                  next steps with the Aria team.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quiz" className="bg-[#111] px-5 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl">
          {!started ? (
            <div className="rounded-[2rem] border border-[#d6b968]/30 bg-black p-9 text-center md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
                Personalized treatment path
              </p>
              <h2 className="mt-4 text-4xl font-semibold md:text-5xl">
                Explore your smile options.
              </h2>
              <button
                onClick={() => setStarted(true)}
                className="mt-8 rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black"
              >
                Start the questionnaire
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
              <div className="border-b border-white/10 px-7 py-5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#d6b968]">
                    {step < questions.length
                      ? `Question ${step + 1} of ${questions.length}`
                      : "Contact information"}
                  </span>
                  <span className="text-white/40">
                    {Math.round(((step + 1) / (questions.length + 1)) * 100)}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#d6b968]"
                    style={{
                      width: `${((step + 1) / (questions.length + 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {step < questions.length ? (
                <div className="p-7 md:p-10">
                  <h2 className="text-3xl font-semibold md:text-4xl">
                    {questions[step].title}
                  </h2>
                  <div className="mt-8 grid gap-3">
                    {questions[step].options.map((option) => (
                      <button
                        key={option}
                        onClick={() => choose(option)}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left font-medium transition hover:border-[#d6b968]/70"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      onClick={() => setStep((current) => current - 1)}
                      className="mt-6 text-sm font-semibold text-white/50"
                    >
                      ← Back
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={submit} className="p-7 md:p-10">
                  <h2 className="text-3xl font-semibold md:text-4xl">
                    Where should Aria send your next steps?
                  </h2>
                  <p className="mt-3 text-white/50">
                    Demonstration only. This form does not send data anywhere.
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {[
                      ["First name", "text"],
                      ["Last name", "text"],
                      ["Mobile phone", "tel"],
                      ["Email address", "email"],
                    ].map(([label, type]) => (
                      <label key={label} className="grid gap-2 text-sm">
                        <span className="text-white/65">{label}</span>
                        <input
                          required
                          type={type}
                          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-white outline-none focus:border-[#d6b968]"
                        />
                      </label>
                    ))}
                  </div>

                  <label className="mt-6 flex gap-3 text-sm leading-6 text-white/50">
                    <input required type="checkbox" className="mt-1" />
                    <span>
                      I consent to receive calls, emails, and text messages
                      regarding my inquiry.
                    </span>
                  </label>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="rounded-full bg-[#d6b968] px-7 py-4 font-bold text-black"
                    >
                      See My Next Steps
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(questions.length - 1)}
                      className="rounded-full border border-white/15 px-7 py-4 font-semibold"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
            Patient experiences
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Real feedback from Aria patients.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "/images/review-carlos.png",
              "/images/review-melanni.png",
              "/images/review-william.png",
            ].map((src, index) => (
              <div
                key={src}
                className="rounded-[1.5rem] border border-black/10 bg-white p-3"
              >
                <Image
                  src={src}
                  alt={`Aria patient review ${index + 1}`}
                  width={800}
                  height={900}
                  className="h-auto w-full rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
              Meet your dentist
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Dr. Ana Blain, DMD</h2>
            <p className="mt-5 leading-7 text-white/60">
              Boston University Doctor in Dental Medicine with High Honors.
              Doctor of Dentistry, Golden Title, from the Faculty of Medical
              Sciences in Havana. Certified Invisalign Provider with facial
              injectables and BLS/CPR certifications.
            </p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-7">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#d6b968]">
              Miami destination practice
            </p>
            <p className="mt-4 text-2xl font-semibold">
              1645 SW 107 Ave, Miami, FL 33165
            </p>
            <p className="mt-4 leading-7 text-white/55">
              The travel question helps Aria distinguish general interest from
              prospects who can realistically complete treatment in Miami.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#080808] px-5 py-9 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-7 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={150}
            height={60}
            className="h-auto w-32"
          />
          <p>
            Proof of concept. Treatment suitability, pricing, and financing
            require confirmation by Aria Smile Design.
          </p>
        </div>
      </footer>
    </main>
  );
}
