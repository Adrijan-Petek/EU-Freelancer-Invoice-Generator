type DashboardStatsProps = {
  totalInvoiced: number;
  paidCount: number;
  draftCount: number;
  currency: string;
  labels: {
    earnings: string;
    totalInvoiced: string;
    paidInvoices: string;
    draftInvoices: string;
  };
};

export function DashboardStats({
  totalInvoiced,
  paidCount,
  draftCount,
  currency,
  labels
}: DashboardStatsProps): JSX.Element {
  const cards = [
    { title: labels.totalInvoiced, value: `${currency} ${totalInvoiced.toFixed(2)}` },
    { title: labels.paidInvoices, value: String(paidCount) },
    { title: labels.draftInvoices, value: String(draftCount) }
  ];

  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{labels.earnings}</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <article key={card.title} className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/80">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
