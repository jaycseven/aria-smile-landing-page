"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type Answers = {
  concern: string;
  treatment: string;
  timeline: string;
  travel: string;
  payment: string;
};

const questions = [
  {
    key: "concern",
    title: "What would you most like to improve about your smile?",
    helper: "Choose the concern that matters most to you right now.",
    options: [
      "Color or staining",
      "Shape or size",
      "Gaps or spacing",
      "Chipped or damaged teeth",
      "Missing tooth or teeth",
      "Several concerns",
      "I am not sure yet",
    ],
  },
  {
    key: "treatment",
    title: "Which treatment would you like to explore?",
    helper:
      "Not sure yet? That is completely fine. The Aria team can explain the differences.",
    options: [
      "Express Smile, $3,000",
      "Porcelain Smile, $5,000",
      "Dental Implants, from $2,500",
      "I need help choosing",
    ],
  },
  {
    key: "timeline",
    title: "When would you ideally like to begin treatment?",
    helper:
      "This helps Aria understand how quickly you would like to move forward.",
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
    title:
      "Treatment takes place at Aria Smile Design in Miami. Can you travel to Miami?",
    helper:
      "Aria welcomes patients from across the United States. Scheduling can be reviewed before you travel.",
    options: [
      "Yes",
      "Yes, depending on scheduling",
      "I would like more travel information",
      "No",
    ],
  },
  {
    key: "payment",
    title: "Which payment option would you most likely consider?",
    helper:
      "Financing may be available through third-party providers for qualified applicants.",
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
  concern: "",
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

    const readySoon = [
      "As soon as possible",
      "Within 30 days",
      "Within one to three months",
    ].includes(answers.timeline);

    const hasPaymentPath = [
      "Financing",
      "Credit or debit card",
      "Savings or cash",
      "I would like to discuss my options",
    ].includes(answers.payment);

    if (answers.travel === "No") {
      return {
        publicTitle: "Treatment is completed in Miami",
        internalTitle: "Currently Unqualified",
        qualified: false,
        explanation:
          "Travel is currently the main limitation. Aria can still explain scheduling and the treatment process.",
      };
    }

    if (canTravel && readySoon && hasPaymentPath) {
      return {
        publicTitle: "You may be ready for the next step",
        internalTitle: "Qualified Lead",
        qualified: true,
        explanation:
          "This visitor can travel to Miami, wants treatment within 90 days, and has a realistic payment path.",
      };
    }

    if (canTravel && (readySoon || hasPaymentPath)) {
      return {
        publicTitle: "Your next step can start with a conversation",
        internalTitle: "Sales Review",
        qualified: false,
        explanation:
          "This visitor shows meaningful interest but needs more qualification around timing or payment.",
      };
    }

    return {
      publicTitle: "Thank you for exploring your options",
      internalTitle: "Nurture Lead",
      qualified: false,
      explanation:
        "This visitor submitted valid information but is not currently ready for immediate treatment.",
    };
  }, [answers]);

  const beginQuiz = () => {
    setStarted(true);
    window.setTimeout(() => {
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const choose = (value: string) => {
    const question = questions[step];
    setAnswers((current) => ({ ...current, [question.key]: value }));

    window.setTimeout(() => {
      if (step < questions.length - 1) {
        setStep((current) => current + 1);
      } else {
        setStep(questions.length);
      }
    }, 140);
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
      <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={210}
            height={90}
            className="mx-auto mb-7 h-auto w-40 object-contain sm:w-44"
            priority
          />

          <section className="overflow-hidden rounded-3xl border border-[#d6b968]/40 bg-[#111] shadow-2xl">
            <div className="border-b border-white/10 p-6 sm:p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
                Your next step
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                {result.publicTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                An Aria team member would review your answers and discuss
                treatment options, timing, travel, pricing, financing, and
                consultation availability.
              </p>
            </div>

            <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-3xl bg-white p-5 text-black sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                  Internal demonstration
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {result.internalTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  {result.explanation}
                </p>

                <div className="mt-5 space-y-4 text-sm">
                  {Object.entries(answers).map(([key, value]) => (
                    <div key={key} className="border-b border-black/10 pb-3">
                      <p className="capitalize text-black/45">{key}</p>
                      <p className="mt-1 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
                <h2 className="text-xl font-semibold">
                  Proposed conversion logic
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  Every valid submission becomes a standard lead. The stronger
                  qualified lead signal is only sent when the visitor can
                  travel to Miami, wants treatment within 90 days, and has a
                  realistic payment path.
                </p>
                <button
                  type="button"
                  onClick={() => setShowEvents((value) => !value)}
                  className="mt-6 w-full rounded-full bg-[#d6b968] px-5 py-3.5 font-bold text-black"
                >
                  {showEvents ? "Hide event map" : "Show event map"}
                </button>
              </div>
            </div>

            {showEvents && (
              <div className="border-t border-white/10 p-6 sm:p-8 md:p-10">
                <div className="grid gap-4 sm:grid-cols-3">
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
                        {result.qualified ? "✓" : "•"} {qualified}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#d6b968]/25 bg-[#d6b968]/10 p-5 text-sm leading-7 text-white/70">
                  Later CRM events should include consultation scheduled,
                  consultation attended, deposit paid, treatment purchased, and
                  actual revenue.
                </div>
              </div>
            )}

            <div className="border-t border-white/10 p-6 sm:p-8 md:p-10">
              <button
                type="button"
                onClick={restart}
                className="w-full rounded-full bg-[#d6b968] px-7 py-4 font-bold text-black sm:w-auto"
              >
                Run Another Lead Scenario
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f5f1e8] text-[#111]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 px-4 py-3.5 text-white backdrop-blur sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={180}
            height={70}
            className="h-auto w-32 object-contain sm:w-40"
            priority
          />
          <button
            type="button"
            onClick={beginQuiz}
            className="shrink-0 rounded-full bg-[#d6b968] px-4 py-2.5 text-xs font-bold text-black sm:px-5 sm:text-sm"
          >
            Find My Smile Option
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-black px-4 py-14 text-white sm:px-6 sm:py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,185,104,0.16),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_.95fr] md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
              Aria Smile Design, Miami
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-7xl">
              Feel confident showing your smile again.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8 md:text-xl">
              Take the 60-second smile questionnaire to explore treatment
              options, pricing, financing, travel requirements, and your next
              step with Aria Smile Design.
            </p>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#d6b968] sm:text-base">
              Treatment options start from $2,500. Financing may be available
              for qualified applicants.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={beginQuiz}
                className="rounded-full bg-[#d6b968] px-7 py-4 font-bold text-black"
              >
                Find My Smile Option
              </button>
              <a
                href="#what-happens-next"
                className="rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white"
              >
                See What Happens Next
              </a>
            </div>

            <div className="mt-6 grid gap-2 text-sm text-white/50 sm:flex sm:flex-wrap sm:gap-x-5">
              <span>✓ About 60 seconds</span>
              <span>✓ No obligation</span>
              <span>✓ Nationwide patients welcome</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#d6b968]/30 bg-[#111] p-2.5 shadow-2xl sm:p-3">
            <Image
              src="/images/aria-before-after.png"
              alt="Aria Smile Design before and after transformations"
              width={1000}
              height={800}
              className="h-auto w-full rounded-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[.85fr_1.15fr] md:items-center md:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
              You are not alone
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Do you find yourself hiding your smile?
            </h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
            <p>
              Maybe you avoid showing your teeth in photos. Maybe you cover
              your mouth when you laugh. Or maybe you have thought about
              changing your smile for years but have not known where to begin.
            </p>
            <p>
              The first step is understanding which option may fit your
              concerns, timing, travel ability, and budget.
            </p>
            <button
              type="button"
              onClick={beginQuiz}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white sm:w-auto"
            >
              Take the Smile Questionnaire
            </button>
          </div>
        </div>
      </section>

      <section
        id="what-happens-next"
        className="border-y border-black/10 bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
              A useful first step
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Know what happens after you submit.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
              Your questionnaire gives the Aria team context before they speak
              with you. The next conversation can focus on the questions that
              matter most.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["1", "Review your goals", "Aria reviews your smile concerns and the treatment option you selected."],
              ["2", "Discuss the right path", "The team explains which options may be worth exploring further."],
              ["3", "Review the details", "Talk through timing, Miami travel, pricing, and financing availability."],
              ["4", "Plan the consultation", "Schedule the right next step when the treatment and timing fit."],
            ].map(([number, title, text]) => (
              <article
                key={number}
                className="rounded-3xl border border-black/10 bg-[#f7f3ea] p-5 sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-bold text-[#d6b968]">
                  {number}
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
            Treatment options
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            A clearer path to the smile you want.
          </h2>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Express Smile",
                price: "$3,000",
                body:
                  "A focused cosmetic option for patients who want a faster path to a cleaner, more balanced smile.",
                concerns:
                  "May help improve concerns related to color, shape, minor spacing, or uneven-looking teeth.",
              },
              {
                title: "Porcelain Smile",
                price: "$5,000",
                body:
                  "A premium porcelain option for patients looking for a more complete cosmetic transformation.",
                concerns:
                  "May improve color, shape, spacing, symmetry, and the overall appearance of the smile.",
              },
              {
                title: "Dental Implants",
                price: "From $2,500",
                body:
                  "A restorative option for patients looking to replace a missing tooth with a stable, natural-looking solution.",
                concerns:
                  "Designed to restore appearance and function when a tooth is missing.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d7229] sm:text-sm">
                  {item.price}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-black/60">{item.body}</p>
                <div className="mt-5 rounded-2xl bg-[#f5f1e8] p-4 text-sm leading-6 text-black/60">
                  {item.concerns}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="mb-4 text-base font-medium sm:text-lg">
              Not sure which treatment is right for you?
            </p>
            <button
              type="button"
              onClick={beginQuiz}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white sm:w-auto"
            >
              Find My Best Option
            </button>
          </div>
        </div>
      </section>

      <section id="quiz" className="bg-[#111] px-4 py-14 text-white sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {!started ? (
            <div className="rounded-3xl border border-[#d6b968]/30 bg-black p-6 text-center sm:p-9 md:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
                Personalized treatment path
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Find out which smile option may fit you.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Your answers help Aria understand what you want to improve, how
                soon you want treatment, whether you can travel to Miami, and
                which payment option may work for you.
              </p>
              <div className="mx-auto mt-6 grid max-w-2xl gap-2 text-sm text-white/50 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
                <span>✓ About 60 seconds</span>
                <span>✓ No obligation</span>
                <span>✓ Financing may be available</span>
              </div>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-8 w-full rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black sm:w-auto"
              >
                Start My Smile Questionnaire
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <div className="border-b border-white/10 px-5 py-5 sm:px-7">
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
                <div className="p-5 sm:p-7 md:p-10">
                  <h2 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                    {questions[step].title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/50 sm:text-base">
                    {questions[step].helper}
                  </p>
                  <div className="mt-7 grid gap-3">
                    {questions[step].options.map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => choose(option)}
                        className="min-h-14 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left text-sm font-medium transition hover:border-[#d6b968]/70 hover:bg-white/[0.07] sm:text-base"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((current) => current - 1)}
                      className="mt-6 text-sm font-semibold text-white/50"
                    >
                      Back
                    </button>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="bg-[#f5f1e8] p-5 text-black sm:p-7 md:p-10"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
                    Your next step
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                    Let Aria review your answers.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60 sm:text-base">
                    Enter your information so the Aria team can discuss your
                    treatment interests, timing, travel, pricing, financing,
                    and consultation availability.
                  </p>
                  <p className="mt-3 text-sm font-medium text-black/55">
                    There is no obligation to begin treatment.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {[
                      ["First name", "text"],
                      ["Last name", "text"],
                      ["Mobile phone", "tel"],
                      ["Email address", "email"],
                    ].map(([label, type]) => (
                      <label key={label} className="grid gap-2 text-sm">
                        <span className="font-medium text-black/65">{label}</span>
                        <input
                          required
                          type={type}
                          className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                        />
                      </label>
                    ))}
                  </div>

                  <label className="mt-6 flex gap-3 text-sm leading-6 text-black/50">
                    <input required type="checkbox" className="mt-1 h-4 w-4 shrink-0" />
                    <span>
                      I consent to receive calls, emails, and text messages
                      regarding my inquiry. Message and data rates may apply.
                    </span>
                  </label>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-black px-7 py-4 font-bold text-white sm:w-auto"
                    >
                      Show Me My Next Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(questions.length - 1)}
                      className="w-full rounded-full border border-black/15 px-7 py-4 font-semibold sm:w-auto"
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

      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
            Smile transformations
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Imagine feeling comfortable showing your smile again.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
            Every patient begins with different concerns and goals. These
            transformations show what may be possible with an individualized
            treatment plan.
          </p>
          <div className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white p-2.5 shadow-sm sm:p-3">
            <Image
              src="/images/aria-before-after.png"
              alt="Aria patient smile transformations"
              width={1200}
              height={900}
              className="h-auto w-full rounded-2xl"
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-black/45 sm:text-sm">
            Individual results vary. A consultation is required to determine
            treatment suitability.
          </p>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
            Patient experiences
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Patients remember more than the final result.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
            They remember how they were treated, how clearly the process was
            explained, and how comfortable they felt along the way.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              "/images/review-carlos.png",
              "/images/review-melanni.png",
              "/images/review-william.png",
            ].map((src, index) => (
              <div
                key={src}
                className="rounded-3xl border border-black/10 bg-[#f7f3ea] p-3"
              >
                <Image
                  src={src}
                  alt={`Aria patient Google review ${index + 1}`}
                  width={800}
                  height={900}
                  className="h-auto w-full rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-14 text-white sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[.85fr_1.15fr] md:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
              Meet your dentist
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Experience, precision, and a personal approach.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/60 sm:text-base">
              Dr. Ana Blain combines advanced dental education, cosmetic
              experience, and an individualized approach to help patients
              understand their options and make informed treatment decisions.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-2xl font-semibold">Dr. Ana Blain, DMD</h3>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/58">
              <p>Boston University, Doctor in Dental Medicine, High Honors</p>
              <p>
                Faculty of Medical Sciences, Havana, Doctor of Dentistry,
                Golden Title
              </p>
              <p>Certified Invisalign Provider</p>
              <p>Facial Injectables Certification</p>
              <p>BLS/CPR, American Heart Association</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-2 md:items-center md:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
              Flexible payment options
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Explore your options before deciding what is possible.
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
              Aria works with third-party financing providers that may offer
              flexible payment options to qualified applicants. The team can
              explain available choices and help you understand which option
              may fit your situation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              {["Cherry", "CareCredit", "Sunbit", "Proceed Finance"].map(
                (provider) => (
                  <span
                    key={provider}
                    className="rounded-full border border-black/10 bg-white px-4 py-2"
                  >
                    {provider}
                  </span>
                )
              )}
            </div>
            <button
              type="button"
              onClick={beginQuiz}
              className="mt-7 w-full rounded-full bg-black px-7 py-4 font-bold text-white sm:w-auto"
            >
              See My Treatment Options
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#d6b968] px-4 py-14 text-black sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
            Traveling to Miami
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Understand the process before you make travel plans.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
            Aria Smile Design welcomes patients from across the United States.
            Treatment requirements, timing, and consultation availability can
            be reviewed before travel so you know what to expect.
          </p>
          <p className="mt-5 font-semibold">
            1645 SW 107 Ave, Miami, FL 33165
          </p>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
            Common questions
          </p>
          <h2 className="mt-3 text-center text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Clarity before commitment.
          </h2>

          <div className="mt-9 grid gap-4">
            {[
              [
                "Do I need to know which treatment I want?",
                "No. Choose the option that says you need help selecting a treatment. The Aria team can explain which options may be worth discussing.",
              ],
              [
                "Does submitting the questionnaire commit me to treatment?",
                "No. It is simply a first step that helps Aria understand your goals and contact you about possible next steps.",
              ],
              [
                "Can I travel from another state?",
                "Yes. Aria welcomes patients from across the United States. The team can explain timing and scheduling before you make travel plans.",
              ],
              [
                "Is financing available?",
                "Aria works with third-party financing providers. Approval and terms depend on the provider and the applicant.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-2xl border border-black/10 bg-white p-5"
              >
                <summary className="cursor-pointer list-none pr-8 font-semibold">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-black/60">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-4 py-14 text-center text-white sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
            Your next step
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
            You have thought about changing your smile. Now find out what your
            next step could be.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Complete the short questionnaire to explore treatment options,
            pricing, financing, travel requirements, and whether Aria Smile
            Design may be a fit for you.
          </p>
          <button
            type="button"
            onClick={beginQuiz}
            className="mt-8 w-full rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black sm:w-auto"
          >
            Find My Smile Option
          </button>
          <p className="mt-4 text-sm text-white/40">
            Takes about 60 seconds. No obligation.
          </p>
        </div>
      </section>

      <footer className="bg-black px-4 py-8 text-white sm:px-6 sm:py-9">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-7 text-xs leading-5 text-white/40 sm:text-sm md:flex-row md:items-center md:justify-between">
          <Image
            src="/images/aria-logo.png"
            alt="Aria Smile Design"
            width={150}
            height={60}
            className="h-auto w-28 sm:w-32"
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
