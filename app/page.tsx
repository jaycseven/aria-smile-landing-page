"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type Answers = {
  concern: string;
  motivation: string;
  timeline: string;
  travel: string;
  payment: string;
};

type Contact = {
  firstName: string;
  phone: string;
  email: string;
  zip: string;
  contactMethod: string;
  consent: boolean;
};

const questions = [
  {
    key: "concern",
    title: "What would you most like to change about your smile?",
    helper: "Choose the concern that matters most to you right now.",
    options: [
      "Color or staining",
      "Shape, size, or uneven teeth",
      "Gaps or spacing",
      "Chipped or damaged teeth",
      "Missing tooth or teeth",
      "Several concerns",
      "I am not sure yet",
    ],
  },
  {
    key: "motivation",
    title: "What would changing your smile mean most to you?",
    helper: "Choose the result that feels most important in your life right now.",
    options: [
      "Feeling confident in photos",
      "Smiling without hiding my teeth",
      "Feeling more comfortable around other people",
      "Replacing missing or damaged teeth",
      "Feeling ready for an upcoming event",
      "Understanding what options are available",
    ],
  },
  {
    key: "timeline",
    title: "When would you ideally like to begin improving your smile?",
    helper: "This helps Aria understand how quickly you would like to move forward.",
    options: [
      "As soon as possible",
      "Within 30 days",
      "Within one to three months",
      "Within three to six months",
      "I am researching for the future",
    ],
  },
  {
    key: "travel",
    title:
      "If the recommended treatment and timing are right, would you be able to travel to Miami?",
    helper:
      "Aria welcomes patients from across the United States and reviews scheduling before you travel.",
    options: [
      "Yes, I can travel to Miami",
      "Yes, depending on the schedule",
      "I need more information before deciding",
      "No, I cannot travel to Miami",
    ],
  },
  {
    key: "payment",
    title: "Which payment option would you most likely consider?",
    helper:
      "Financing may be available through third-party providers for qualified applicants.",
    options: [
      "Financing",
      "Savings, cash, or card",
      "A combination of payment methods",
      "I need to understand the cost first",
      "I am not financially ready",
    ],
  },
] as const;

const blankAnswers: Answers = {
  concern: "",
  motivation: "",
  timeline: "",
  travel: "",
  payment: "",
};

const blankContact: Contact = {
  firstName: "",
  phone: "",
  email: "",
  zip: "",
  contactMethod: "Text me first",
  consent: false,
};

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(blankAnswers);
  const [contact, setContact] = useState<Contact>(blankContact);
  const [submitted, setSubmitted] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const result = useMemo(() => {
    const canTravel =
      answers.travel === "Yes, I can travel to Miami" ||
      answers.travel === "Yes, depending on the schedule";

    const readyWithin90Days = [
      "As soon as possible",
      "Within 30 days",
      "Within one to three months",
    ].includes(answers.timeline);

    const viablePaymentPath = [
      "Financing",
      "Savings, cash, or card",
      "A combination of payment methods",
      "I need to understand the cost first",
    ].includes(answers.payment);

    const highPriority =
      answers.travel === "Yes, I can travel to Miami" &&
      ["As soon as possible", "Within 30 days"].includes(answers.timeline) &&
      viablePaymentPath;

    if (answers.travel === "No, I cannot travel to Miami") {
      return {
        publicTitle: "Treatment is completed in Miami",
        internalTitle: "Not Qualified",
        qualified: false,
        highPriority: false,
        explanation:
          "Travel is currently the main limitation. Aria can still explain scheduling and the treatment process.",
      };
    }

    if (canTravel && readyWithin90Days && viablePaymentPath) {
      return {
        publicTitle: "You may be ready for the next step",
        internalTitle: highPriority ? "High Priority Lead" : "Qualified Lead",
        qualified: true,
        highPriority,
        explanation:
          "This visitor can travel to Miami, wants to move forward within 90 days, and has a realistic payment path.",
      };
    }

    if (
      answers.travel === "I need more information before deciding" ||
      answers.payment === "I need to understand the cost first" ||
      answers.timeline === "Within three to six months"
    ) {
      return {
        publicTitle: "Your next step can start with a conversation",
        internalTitle: "Sales Review",
        qualified: false,
        highPriority: false,
        explanation:
          "This visitor shows meaningful interest but needs more information about timing, travel, or cost.",
      };
    }

    return {
      publicTitle: "Thank you for exploring your options",
      internalTitle: "Nurture Lead",
      qualified: false,
      highPriority: false,
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

    setAnswers((current) => ({
      ...current,
      [question.key]: value,
    }));

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

    if (
      !contact.firstName.trim() ||
      !contact.phone.trim() ||
      !contact.email.trim() ||
      !contact.zip.trim() ||
      !contact.consent
    ) {
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setAnswers(blankAnswers);
    setContact(blankContact);
    setStep(0);
    setStarted(true);
    setSubmitted(false);
    setShowTracking(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
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
                Your smile questionnaire is complete
              </p>
              <h1 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Thank you, {contact.firstName}. Aria will contact you within 24 hours.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                Look for a {contact.contactMethod.toLowerCase()} from Aria Smile
                Design in Miami. The representative will be following up on the
                smile questionnaire you completed here.
              </p>
            </div>

            <div className="border-b border-white/10 bg-[#0b0b0b] p-6 sm:p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d6b968] sm:text-sm">
                What happens next
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    number: "1",
                    title: "Watch for Aria",
                    text:
                      "An Aria Smile Design representative will call, text, or email you within 24 hours using your preferred contact method.",
                  },
                  {
                    number: "2",
                    title: "Send smile photos",
                    text:
                      "The representative will explain how to send clear photos of your current smile and teeth for the dental team to review.",
                  },
                  {
                    number: "3",
                    title: "Review your options",
                    text:
                      "After reviewing your answers and photos, Aria can discuss possible treatment, timing, travel, pricing, financing, and your next step.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6b968] font-bold text-black">
                      {item.number}
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#d6b968]/35 bg-[#d6b968]/10 p-5">
                <p className="font-semibold text-[#ead58e]">
                  Remember the name Aria Smile Design
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  When Aria contacts you, they will mention the smile
                  questionnaire you completed and the goal you selected:
                  <span className="font-semibold text-white">
                    {" "}
                    {answers.motivation}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-3xl bg-white p-5 text-black sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
                  Internal presentation view
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
                <h2 className="text-xl font-semibold">Proposed tracking logic</h2>
                <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
                  Every valid form submission becomes a standard lead. The
                  stronger qualified lead signal is only sent when the visitor
                  can travel to Miami, wants to begin within 90 days, and has a
                  realistic payment path.
                </p>
                <button
                  type="button"
                  onClick={() => setShowTracking((value) => !value)}
                  className="mt-6 w-full rounded-full bg-[#d6b968] px-5 py-3.5 font-bold text-black"
                >
                  {showTracking ? "Hide Tracking Logic" : "View Tracking Logic"}
                </button>
              </div>
            </div>

            {showTracking && (
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
                  Later CRM events should include smile photos submitted,
                  treatment plan created, consultation scheduled, consultation
                  attended, deposit paid, treatment purchased, and actual
                  revenue.
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
            Start My Smile Review
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
            <h1 className="mt-4 max-w-3xl font-[Georgia,serif] text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-7xl">
              Feel confident showing your smile again.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8 md:text-xl">
              Take the 60-second smile questionnaire so Aria can understand
              your goals, timing, travel plans, and what you hope to change
              about your smile.
            </p>
            <p className="mt-4 text-sm font-semibold leading-6 text-[#d6b968] sm:text-base">
              After speaking with you, Aria will explain how to send photos of
              your smile for the dental team to review.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={beginQuiz}
                className="rounded-full bg-[#d6b968] px-7 py-4 font-bold text-black"
              >
                Start My Smile Review
              </button>
              <a
                href="#what-happens-next"
                className="rounded-full border border-white/20 px-7 py-4 text-center font-semibold text-white"
              >
                See What Happens Next
              </a>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/45">
              Saw a specific Aria offer in an ad? The team will confirm what is
              included and whether it may fit your situation after reviewing
              your information and smile photos.
            </p>

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
            <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
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
              The first step is understanding what you want to change and
              whether Aria may be the right fit for your goals, timing, and
              ability to travel to Miami.
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
            <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Know what happens after you submit.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
              Your questionnaire gives Aria context before the first
              conversation. The team can focus on the questions that matter
              most to you.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [
                "1",
                "Complete the questionnaire",
                "Tell Aria what you want to change, when you want to begin, and whether you can travel to Miami.",
              ],
              [
                "2",
                "Speak with Aria",
                "A representative contacts you within 24 hours and reviews the answers you submitted.",
              ],
              [
                "3",
                "Send smile photos",
                "The representative explains how to send clear photos of your smile and teeth for review.",
              ],
              [
                "4",
                "Discuss your next step",
                "Aria reviews the information and discusses possible treatment, timing, travel, pricing, and financing.",
              ],
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
          <div className="grid gap-8 md:grid-cols-[.85fr_1.15fr] md:items-center md:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7229] sm:text-sm">
                Personalized smile review
              </p>
              <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Your smile should not be reduced to a package.
              </h2>
            </div>

            <div>
              <p className="text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
                Every smile begins with a different concern. Aria first learns
                what you want to change, how soon you want to move forward, and
                whether you can travel to Miami. After the team speaks with
                you, they will explain how to send photos of your smile for a
                more personal review.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Color, shape, spacing, or symmetry",
                  "Chipped, worn, or damaged teeth",
                  "Missing teeth or restorative concerns",
                  "A complete cosmetic smile transformation",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-black/10 bg-white p-4 text-sm font-medium leading-6"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={beginQuiz}
                className="mt-7 w-full rounded-full bg-black px-7 py-4 font-bold text-white sm:w-auto"
              >
                Start My Smile Review
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="quiz"
        className="bg-[#111] px-4 py-14 text-white sm:px-6 sm:py-16 md:py-24"
      >
        <div className="mx-auto max-w-4xl">
          {!started ? (
            <div className="rounded-3xl border border-[#d6b968]/30 bg-black p-6 text-center sm:p-9 md:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b968] sm:text-sm">
                Personalized smile review
              </p>
              <h2 className="mt-4 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                Tell Aria what you want to change about your smile.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Your answers give the Aria team context before they contact
                you. This helps the first conversation focus on your goals,
                timing, Miami travel, and the next step that may make sense.
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
                  <h2 className="font-[Georgia,serif] text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
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
                  <h2 className="mt-3 font-[Georgia,serif] text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                    Let Aria review your answers.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60 sm:text-base">
                    Enter your information so an Aria representative can
                    contact you within 24 hours, review your answers, and
                    explain how to send photos of your smile and teeth.
                  </p>
                  <p className="mt-3 text-sm font-medium text-black/55">
                    There is no obligation to begin treatment.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm">
                      <span className="font-medium text-black/65">First name</span>
                      <input
                        required
                        type="text"
                        autoComplete="given-name"
                        value={contact.firstName}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            firstName: event.target.value,
                          }))
                        }
                        className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      <span className="font-medium text-black/65">Mobile phone</span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={contact.phone}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      <span className="font-medium text-black/65">Email address</span>
                      <input
                        required
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={contact.email}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      <span className="font-medium text-black/65">ZIP code</span>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={contact.zip}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            zip: event.target.value,
                          }))
                        }
                        className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                      />
                    </label>

                    <label className="grid gap-2 text-sm sm:col-span-2">
                      <span className="font-medium text-black/65">
                        How would you like Aria to contact you first?
                      </span>
                      <select
                        value={contact.contactMethod}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            contactMethod: event.target.value,
                          }))
                        }
                        className="min-h-12 rounded-xl border border-black/15 bg-white px-4 py-3.5 text-base text-black outline-none focus:border-[#8d7229]"
                      >
                        <option>Text me first</option>
                        <option>Call me</option>
                        <option>Email me</option>
                      </select>
                    </label>
                  </div>

                  <label className="mt-6 flex gap-3 text-sm leading-6 text-black/50">
                    <input
                      required
                      type="checkbox"
                      checked={contact.consent}
                      onChange={(event) =>
                        setContact((current) => ({
                          ...current,
                          consent: event.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 shrink-0"
                    />
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
          <h2 className="mt-3 max-w-4xl font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
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
          <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
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
            <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl">
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
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/60">
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
            <h2 className="mt-3 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Understand your options before deciding what is possible.
            </h2>
          </div>

          <div>
            <p className="text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
              Treatment recommendations and final pricing depend on your
              individual situation. Aria works with third-party financing
              providers that may offer flexible payment options to qualified
              applicants.
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
              Start My Smile Review
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#d6b968] px-4 py-14 text-black sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] sm:text-sm">
            Traveling to Miami
          </p>
          <h2 className="mt-3 max-w-4xl font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
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
          <h2 className="mt-3 text-center font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Clarity before commitment.
          </h2>

          <div className="mt-9 grid gap-4">
            {[
              [
                "Do I need to know which treatment I want?",
                "No. Aria can learn about your concerns first and discuss which options may be worth exploring after reviewing your information and smile photos.",
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
          <h2 className="mt-4 font-[Georgia,serif] text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
            You have thought about changing your smile. Now find out what your
            next step could be.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Complete the short questionnaire so Aria can understand your goals,
            contact you within 24 hours, and explain how to submit photos of
            your smile for review.
          </p>
          <button
            type="button"
            onClick={beginQuiz}
            className="mt-8 w-full rounded-full bg-[#d6b968] px-8 py-4 font-bold text-black sm:w-auto"
          >
            Start My Smile Review
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
            Treatment suitability, pricing, financing, and final
            recommendations require review by the Aria dental team.
          </p>
        </div>
      </footer>
    </main>
  );
}
