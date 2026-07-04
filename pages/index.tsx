import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { DashboardStats } from "../components/DashboardStats";
import { InvoiceForm } from "../components/InvoiceForm";
import { InvoiceTable } from "../components/InvoiceTable";
import { ThemeToggle } from "../components/ThemeToggle";
import { enrichInvoiceDraft } from "../lib/calculations";
import { t } from "../lib/i18n";
import { InvoiceDraft, InvoiceRecord, Language } from "../lib/types";
import { exportInvoicesCsv } from "../utils/csv";
import { downloadInvoicePdf } from "../utils/pdf";

type InvoiceInput = Omit<InvoiceDraft, "vatResult" | "subtotal" | "vatAmount" | "total">;

function createEmptyDraft(language: Language): InvoiceInput {
  const today = dayjs().format("YYYY-MM-DD");
  return {
    invoiceNumber: "",
    issueDate: today,
    dueDate: dayjs(today).add(14, "day").format("YYYY-MM-DD"),
    currency: "EUR",
    language,
    freelancer: {
      name: "",
      address: "",
      country: "SI",
      vatId: ""
    },
    client: {
      name: "",
      address: "",
      country: "DE",
      vatId: ""
    },
    serviceItems: [{ description: "Consulting", quantity: 1, unitPrice: 250 }],
    userVatRate: 22,
    status: "draft",
    notes: ""
  };
}

export default function Home(): JSX.Element {
  const [language, setLanguage] = useState<Language>("en");
  const [draft, setDraft] = useState<InvoiceInput>(() => createEmptyDraft("en"));
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const profile = localStorage.getItem("freelancerProfile");
    if (profile) {
      const parsed = JSON.parse(profile);
      setDraft((prev) => ({ ...prev, freelancer: { ...prev.freelancer, ...parsed } }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("freelancerProfile", JSON.stringify(draft.freelancer));
  }, [draft.freelancer]);

  useEffect(() => {
    setDraft((prev) => ({ ...prev, language }));
  }, [language]);

  async function fetchInvoices(): Promise<void> {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/invoices");
      const json = await response.json();
      setInvoices(json.data || []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Failed to load invoices.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  function toggleDarkMode(): void {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function saveInvoice(): Promise<void> {
    setError("");
    const endpoint = selectedId ? `/api/invoices?id=${selectedId}` : "/api/invoices";
    const method = selectedId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      await fetchInvoices();
      setSelectedId(null);
      setDraft(createEmptyDraft(language));
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save invoice.");
    }
  }

  function startEdit(invoice: InvoiceRecord): void {
    setSelectedId(invoice.id);
    setLanguage(invoice.language);
    setDraft({
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      currency: invoice.currency,
      language: invoice.language,
      freelancer: invoice.freelancer,
      client: invoice.client,
      serviceItems: invoice.serviceItems,
      userVatRate: invoice.userVatRate,
      status: invoice.status,
      notes: invoice.notes || ""
    });
  }

  function startDuplicate(invoice: InvoiceRecord): void {
    setSelectedId(null);
    setLanguage(invoice.language);
    setDraft({
      invoiceNumber: "",
      issueDate: dayjs().format("YYYY-MM-DD"),
      dueDate: dayjs().add(14, "day").format("YYYY-MM-DD"),
      currency: invoice.currency,
      language: invoice.language,
      freelancer: invoice.freelancer,
      client: invoice.client,
      serviceItems: invoice.serviceItems,
      userVatRate: invoice.userVatRate,
      status: "draft",
      notes: invoice.notes || ""
    });
  }

  async function removeInvoice(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/invoices?id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      await fetchInvoices();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Could not delete invoice.");
    }
  }

  function resetForm(): void {
    setSelectedId(null);
    setDraft(createEmptyDraft(language));
  }

  function applyTemplate(type: "development" | "design"): void {
    const templates = {
      development: [
        { description: "Feature development sprint", quantity: 5, unitPrice: 420 },
        { description: "Code review", quantity: 3, unitPrice: 180 }
      ],
      design: [
        { description: "Landing page UI design", quantity: 2, unitPrice: 600 },
        { description: "Design system updates", quantity: 4, unitPrice: 220 }
      ]
    };

    setDraft((prev) => ({ ...prev, serviceItems: templates[type] }));
  }

  const preview = useMemo(() => enrichInvoiceDraft(draft), [draft]);

  const totals = useMemo(() => {
    return {
      totalInvoiced: invoices.reduce((sum, item) => sum + item.total, 0),
      paidCount: invoices.filter((item) => item.status === "paid").length,
      draftCount: invoices.filter((item) => item.status === "draft").length
    };
  }, [invoices]);

  const labels = {
    title: t(language, "title"),
    subtitle: t(language, "subtitle"),
    newInvoice: t(language, "newInvoice"),
    saveInvoice: t(language, "saveInvoice"),
    updateInvoice: t(language, "updateInvoice"),
    duplicate: t(language, "duplicate"),
    invoiceHistory: t(language, "invoiceHistory"),
    earnings: t(language, "earnings"),
    totalInvoiced: t(language, "totalInvoiced"),
    paidInvoices: t(language, "paidInvoices"),
    draftInvoices: t(language, "draftInvoices"),
    freelancer: t(language, "freelancer"),
    client: t(language, "client"),
    services: t(language, "services"),
    downloadPdf: t(language, "downloadPdf"),
    exportCsv: t(language, "exportCsv")
  };

  return (
    <>
      <Head>
        <title>EU Freelancer Invoice Generator</title>
        <meta name="description" content="Create EU-compliant freelance invoices with VAT logic" />
      </Head>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {labels.title}
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Pricing
            </Link>
            <select
              className="input"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="si">SI</option>
            </select>
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              onClick={() => exportInvoicesCsv(invoices)}
            >
              {labels.exportCsv}
            </button>
            <ThemeToggle isDark={isDark} onToggle={toggleDarkMode} />
          </div>
        </header>

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <DashboardStats
            totalInvoiced={totals.totalInvoiced}
            paidCount={totals.paidCount}
            draftCount={totals.draftCount}
            currency={draft.currency}
            labels={{
              earnings: labels.earnings,
              totalInvoiced: labels.totalInvoiced,
              paidInvoices: labels.paidInvoices,
              draftInvoices: labels.draftInvoices
            }}
          />

          <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-2">
            <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">VAT preview</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{preview.vatResult.note}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <article className="rounded-xl bg-slate-100/80 p-3 dark:bg-slate-800/80">
                <p className="text-xs uppercase tracking-wide text-slate-500">Subtotal</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {draft.currency} {preview.subtotal.toFixed(2)}
                </p>
              </article>
              <article className="rounded-xl bg-slate-100/80 p-3 dark:bg-slate-800/80">
                <p className="text-xs uppercase tracking-wide text-slate-500">VAT</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {draft.currency} {preview.vatAmount.toFixed(2)} ({preview.vatResult.vatRateApplied}%)
                </p>
              </article>
              <article className="rounded-xl bg-slate-100/80 p-3 dark:bg-slate-800/80">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {draft.currency} {preview.total.toFixed(2)}
                </p>
              </article>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("development")}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Dev template
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("design")}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Design template
              </button>
            </div>
          </section>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <InvoiceForm
              draft={draft}
              setDraft={setDraft}
              isEditing={selectedId !== null}
              onSubmit={saveInvoice}
              onReset={resetForm}
              saveLabel={labels.saveInvoice}
              updateLabel={labels.updateInvoice}
              labels={{ freelancer: labels.freelancer, client: labels.client, services: labels.services }}
            />
          </div>

          <div className="lg:col-span-2">
            <InvoiceTable
              invoices={invoices}
              onEdit={startEdit}
              onDuplicate={startDuplicate}
              onDelete={removeInvoice}
              onPdf={downloadInvoicePdf}
              labels={{
                invoiceHistory: labels.invoiceHistory,
                duplicate: labels.duplicate,
                downloadPdf: labels.downloadPdf
              }}
            />
          </div>
        </div>

        {isLoading && <p className="mt-4 text-sm text-slate-500">Loading...</p>}
      </div>
    </>
  );
}
