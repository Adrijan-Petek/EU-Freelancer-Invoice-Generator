import Head from "next/head";
import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  checkoutUrl?: string;
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for solo freelancers who want fast compliant invoicing.",
    features: [
      "Invoice creation",
      "EU VAT logic",
      "PDF and CSV export",
      "Invoice history"
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_PAYPAL_STARTER_URL,
    cta: "Start Free"
  },
  {
    name: "Pro",
    price: "EUR 9 / month",
    description: "Built for growth with automation and premium features.",
    features: [
      "Cloud sync",
      "Client management",
      "Advanced VAT automation",
      "Multi-currency",
      "Accounting reports"
    ],
    checkoutUrl: process.env.NEXT_PUBLIC_PAYPAL_PRO_URL,
    cta: "Upgrade to Pro"
  }
];

export default function PricingPage(): JSX.Element {
  return (
    <>
      <Head>
        <title>Pricing | EU Freelancer Invoice Generator</title>
        <meta name="description" content="Choose a plan for EU Freelancer Invoice Generator" />
      </Head>

      <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Simple pricing</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Start free, then upgrade when you need automation and scale.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Back to app
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          {plans.map((plan) => {
            const disabled = !plan.checkoutUrl;

            return (
              <article
                key={plan.name}
                className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/80"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  {plan.name}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{plan.price}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {plan.features.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>

                {disabled ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 w-full rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    Add PayPal URL in env to enable
                  </button>
                ) : (
                  <a
                    href={plan.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block w-full rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    {plan.cta}
                  </a>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
