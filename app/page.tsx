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
    helper: "Choose the concern that matters most to you.",
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
    title: "Which treatment are you most interested in exploring?",
    helper:
      "It is okay if you are unsure. The Aria team can explain the differences.",
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
    helper:
      "This helps the team understand how quickly you would like to move forward.",
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
      "Aria Smile Design performs treatment in Miami. Would you be able to travel to Miami?",
    helper: "Patients visit Aria from across the country.",
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
        name: "Treatment Is Completed in Miami",
        internalName: "Currently Unqualified",
        qualified: false,
        reason:
          "Travel is currently the main limitation. The Aria team can provide more information about scheduling and the treatment process.",
      };
    }

    if (canTravel && soon && payment) {
      return {
        name: "You May Be a Strong Fit for the Next Step",
        internalName: "Qualified Lead",
        qualified: true,
        reason:
          "Based on your answers, you may be ready to speak with the Aria team about treatment options, scheduling, and financing.",
      };
    }

    if (canTravel && (soon || payment)) {
      return {
        name: "Your Smile Journey Can Start with a Conversation",
        internalName: "Sales Review",
        qualified: false,
        reason:
          "The Aria team can help clarify timing, travel, payment options, and the next step.",
      };
    }

    return {
      name: "Thank You for Exploring Your Options",
      internalName: "Nurture Lead",
      qualified: false,
      reason:
        "You may not be ready to begin treatment yet, but the Aria team can still help you understand available options.",
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

  const beginQuiz = () => {
    setStarted(true);
    setTimeout(
      () =>
        document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" }),
      50
    );
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
                Your next step
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                  Internal demonstration
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {result.internalName}
                </h2>
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
                  Every valid form submission becomes a standard lead. The
                  stronger qualified-lead signal is only sent when the visitor
                  can travel to Miami, wants treatment within 90 days, and has
                  a viable payment path.
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
                Run Another Lead Scenario
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
            onClick={beginQuiz}
            className="rounded-full bg-[#d6b968] px-5 py-2.5 text-sm font-bold text-black"
          >
            Find My Smile Option
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
              Your smile should make you feel confident not self-conscious!
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Answer a few quick questions to explore which smile treatment may
              fit your goals, timeline, budget, and ability to travel to Aria
              Smile Design in Miami.
            </p>
            <p className="mt-4 text-base font-medium text-[#d6b968]">
              Treatment options start from $2,500. Financing may be available
              for qualified applicants.
            </p>
            <button
              onClick={beginQuiz}
              className="mt-8 rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black"
            >
              Find My Smile Option
            </button>
            <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/50">
              <span>✓ About 60 seconds</span>
              <span>✓ No obligation</span>
              <span>✓ Nationwide patients welcome</span>
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

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
              You are not alone
            </p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              Do you find yourself hiding your smile?
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-black/65">
            <p>
              Maybe you avoid showing your teeth in photos. Maybe you cover
              your mouth when you laugh. Or maybe you have been thinking about
              changing your smile for years but have not known where to begin.
            </p>
            <p>
              The first step is not choosing a procedure. It is understanding
              which option fits your smile goals, timeline, and budget.
            </p>
            <button
              onClick={beginQuiz}
              className="rounded-full bg-black px-7 py-4 font-bold text-white"
            >
              Take the Smile Questionnaire
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
            Treatment options
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            A clearer path to the smile you want.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Express Smile",
                price: "$3,000",
                body:
                  "A focused cosmetic option for patients who want to improve the appearance of their smile without beginning with a more extensive treatment plan.",
                outcome:
                  "A faster path toward a cleaner, more balanced smile.",
              },
              {
                title: "Porcelain Smile",
                price: "$5,000",
                body:
                  "A premium smile-transformation option for improving color, shape, spacing, symmetry, and overall appearance.",
                outcome:
                  "For patients seeking a more complete cosmetic transformation.",
              },
              {
                title: "Dental Implants",
                price: "From $2,500",
                body:
                  "Replace a missing tooth with a stable, natural-looking solution designed to restore appearance and function.",
                outcome:
                  "A missing tooth should not control how you smile, eat, or speak.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-[1.7rem] border border-black/10 bg-white p-7"
              >
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8d7229]">
                  {item.price}
                </p>
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 leading-7 text-black/60">{item.body}</p>
                <p className="mt-5 font-semibold leading-7">{item.outcome}</p>
              </article>
            ))}
          </div>

          <div className="mt-9 text-center">
            <p className="mb-4 text-lg font-medium">
              Not sure which treatment is right for you?
            </p>
            <button
              onClick={beginQuiz}
              className="rounded-full bg-black px-7 py-4 font-bold text-white"
            >
              Find My Best Option
            </button>
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
                Find out which smile option may fit you.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/60">
                Your answers help Aria understand what you want to improve, how
                soon you want treatment, whether you can travel to Miami, and
                which payment path may work for you.
              </p>
              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-4 text-sm text-white/50">
                <span>✓ About 60 seconds</span>
                <span>✓ No obligation</span>
                <span>✓ Financing may be available</span>
                <span>✓ Nationwide patients welcome</span>
              </div>
              <button
                onClick={() => setStarted(true)}
                className="mt-8 rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black"
              >
                Start My Smile Questionnaire
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
                  <p className="mt-3 text-white/50">
                    {questions[step].helper}
                  </p>
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
                <form
                  onSubmit={submit}
                  className="bg-[#f4efe4] p-7 text-black md:p-10"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d7229]">
                    Your personalized next step
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                    Get your personalized next step.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-black/60">
                    Enter your information so the Aria team can review your
                    answers and discuss treatment options, availability,
                    financing, and what comes next.
                  </p>
                  <p className="mt-3 text-sm font-medium text-black/55">
                    No obligation to begin treatment. Your information is used
                    only to respond to your inquiry.
                  </p>

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                          className="rounded-xl border border-black/15 bg-white px-4 py-3.5 text-black outline-none focus:border-[#8d7229]"
                        />
                      </label>
                    ))}
                  </div>

                  <label className="mt-6 flex gap-3 text-sm leading-6 text-black/50">
                    <input required type="checkbox" className="mt-1" />
                    <span>
                      I consent to receive calls, emails, and text messages
                      regarding my inquiry.
                    </span>
                  </label>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      className="rounded-full bg-black px-7 py-4 font-bold text-white"
                    >
                      Show Me My Next Step
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(questions.length - 1)}
                      className="rounded-full border border-black/15 px-7 py-4 font-semibold"
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
            Smile transformations
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold md:text-5xl">
            Imagine feeling comfortable showing your smile again.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-black/60">
            Every smile begins with different concerns and goals. These patient
            transformations show what may be possible with a personalized
            treatment plan.
          </p>
          <div className="mt-9 overflow-hidden rounded-[2rem] border border-black/10 bg-white p-3">
            <Image
              src="/images/aria-before-after.png"
              alt="Aria patient smile transformations"
              width={1200}
              height={900}
              className="h-auto w-full rounded-[1.4rem]"
            />
          </div>
          <p className="mt-4 text-sm text-black/45">
            Individual results vary. A consultation is required to determine
            treatment suitability.
          </p>
        </div>
      </section>

      <section className="border-t border-black/10 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
            Patient experiences
          </p>
          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Patients remember more than the final result.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-black/60">
            They remember how they were treated, how clearly the process was
            explained, and how comfortable they felt along the way.
          </p>
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

      <section className="bg-black px-5 py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
              Meet your dentist
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              Experience, precision, and a personalized approach.
            </h2>
            <p className="mt-5 leading-7 text-white/60">
              Dr. Ana Blain combines advanced dental education, cosmetic
              experience, and an individualized approach to help patients
              understand their options and make informed treatment decisions.
            </p>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-7">
            <h3 className="text-2xl font-semibold">Dr. Ana Blain, DMD</h3>
            <p className="mt-4 leading-7 text-white/55">
              Boston University Doctor in Dental Medicine with High Honors.
              Doctor of Dentistry, Golden Title, from the Faculty of Medical
              Sciences in Havana. Certified Invisalign Provider with facial
              injectables and BLS/CPR certifications.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7229]">
              Flexible payment paths
            </p>
            <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
              Do not let uncertainty about payment stop you from exploring your
              options.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-black/60">
              Aria works with third-party financing providers that may offer
              flexible payment options to qualified applicants. The team can
              explain available choices and help you understand which path may
              fit your situation.
            </p>
            <button
              onClick={beginQuiz}
              className="mt-7 rounded-full bg-black px-7 py-4 font-bold text-white"
            >
              See My Treatment Options
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#d6b968] px-5 py-16 text-black md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em]">
            Traveling to Miami
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold md:text-5xl">
            Plan your smile transformation with the process explained in
            advance.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-black/65">
            Aria Smile Design welcomes patients from across the United States.
            Treatment requirements and scheduling can be reviewed before
            travel so you understand what to expect.
          </p>
          <p className="mt-5 font-semibold">
            1645 SW 107 Ave, Miami, FL 33165
          </p>
        </div>
      </section>

      <section className="bg-[#0a0a0a] px-5 py-16 text-white md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#d6b968]">
            Your next step
          </p>
          <h2 className="mt-4 text-4xl font-semibold md:text-6xl">
            You have thought about changing your smile. Now find out what your
            next step could be.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/60">
            Complete the short questionnaire to explore treatment options,
            pricing, financing, and whether Aria Smile Design may be a fit for
            you.
          </p>
          <button
            onClick={beginQuiz}
            className="mt-8 rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black"
          >
            Find My Smile Option
          </button>
          <p className="mt-4 text-sm text-white/40">
            Takes about 60 seconds. No obligation.
          </p>
        </div>
      </section>

      <footer className="bg-black px-5 py-9 text-white">
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
