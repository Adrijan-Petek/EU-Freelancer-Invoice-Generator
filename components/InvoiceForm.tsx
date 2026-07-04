import { Dispatch, SetStateAction } from "react";
import { getCountryOptions } from "../lib/eu";
import { InvoiceDraft, ServiceItem } from "../lib/types";

type InvoiceInput = Omit<InvoiceDraft, "vatResult" | "subtotal" | "vatAmount" | "total">;

type InvoiceFormProps = {
  draft: InvoiceInput;
  setDraft: Dispatch<SetStateAction<InvoiceInput>>;
  isEditing: boolean;
  onSubmit: () => void;
  onReset: () => void;
  saveLabel: string;
  updateLabel: string;
  labels: {
    freelancer: string;
    client: string;
    services: string;
  };
};

const countryOptions = getCountryOptions();

function updateServiceItem(items: ServiceItem[], index: number, patch: Partial<ServiceItem>): ServiceItem[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export function InvoiceForm({
  draft,
  setDraft,
  isEditing,
  onSubmit,
  onReset,
  saveLabel,
  updateLabel,
  labels
}: InvoiceFormProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{isEditing ? updateLabel : saveLabel}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {isEditing ? updateLabel : saveLabel}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{labels.freelancer}</h3>
          <input
            className="input"
            placeholder="Name"
            value={draft.freelancer.name}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, freelancer: { ...prev.freelancer, name: e.target.value } }))
            }
          />
          <input
            className="input"
            placeholder="Address"
            value={draft.freelancer.address}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, freelancer: { ...prev.freelancer, address: e.target.value } }))
            }
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              className="input"
              value={draft.freelancer.country}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, freelancer: { ...prev.freelancer, country: e.target.value } }))
              }
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="VAT ID"
              value={draft.freelancer.vatId || ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, freelancer: { ...prev.freelancer, vatId: e.target.value } }))
              }
            />
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{labels.client}</h3>
          <input
            className="input"
            placeholder="Client name"
            value={draft.client.name}
            onChange={(e) => setDraft((prev) => ({ ...prev, client: { ...prev.client, name: e.target.value } }))}
          />
          <input
            className="input"
            placeholder="Client address"
            value={draft.client.address}
            onChange={(e) => setDraft((prev) => ({ ...prev, client: { ...prev.client, address: e.target.value } }))}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <select
              className="input"
              value={draft.client.country}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, client: { ...prev.client, country: e.target.value } }))
              }
            >
              {countryOptions.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Client VAT ID"
              value={draft.client.vatId || ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, client: { ...prev.client, vatId: e.target.value } }))}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <input
          className="input"
          type="date"
          value={draft.issueDate}
          onChange={(e) => setDraft((prev) => ({ ...prev, issueDate: e.target.value }))}
        />
        <input
          className="input"
          type="date"
          value={draft.dueDate}
          onChange={(e) => setDraft((prev) => ({ ...prev, dueDate: e.target.value }))}
        />
        <input
          className="input"
          placeholder="VAT %"
          type="number"
          value={draft.userVatRate}
          onChange={(e) => setDraft((prev) => ({ ...prev, userVatRate: Number(e.target.value) }))}
        />
        <select
          className="input"
          value={draft.status}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, status: e.target.value as "draft" | "sent" | "paid" }))
          }
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="mt-5 rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{labels.services}</h3>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                serviceItems: [...prev.serviceItems, { description: "", quantity: 1, unitPrice: 0 }]
              }))
            }
          >
            Add line
          </button>
        </div>

        <div className="space-y-2">
          {draft.serviceItems.map((item, index) => (
            <div key={`${index}-${item.description}`} className="grid gap-2 sm:grid-cols-12">
              <input
                className="input sm:col-span-6"
                placeholder="Service description"
                value={item.description}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    serviceItems: updateServiceItem(prev.serviceItems, index, { description: e.target.value })
                  }))
                }
              />
              <input
                className="input sm:col-span-2"
                type="number"
                min={0}
                step="0.01"
                value={item.quantity}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    serviceItems: updateServiceItem(prev.serviceItems, index, { quantity: Number(e.target.value) })
                  }))
                }
              />
              <input
                className="input sm:col-span-3"
                type="number"
                min={0}
                step="0.01"
                value={item.unitPrice}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    serviceItems: updateServiceItem(prev.serviceItems, index, { unitPrice: Number(e.target.value) })
                  }))
                }
              />
              <button
                type="button"
                className="rounded-lg border border-red-300 px-2 text-xs font-medium text-red-700 dark:border-red-700 dark:text-red-300"
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    serviceItems: prev.serviceItems.filter((_, i) => i !== index)
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
