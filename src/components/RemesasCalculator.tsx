"use client";

import { useCallback, useEffect, useState } from "react";
import {
  countryFlag,
  formatAmount,
  formatUsd,
  parseAmount,
  type RemesasCountry,
  type RemesasTransactionInfo,
} from "@/lib/remesas-api";

type CalculatorPayload = {
  countries: RemesasCountry[];
  transactionInfo: RemesasTransactionInfo;
  defaultCountry: string;
};

export function RemesasCalculator() {
  const [countries, setCountries] = useState<RemesasCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("CO");
  const [transactionInfo, setTransactionInfo] = useState<RemesasTransactionInfo | null>(
    null,
  );
  const [senderAmount, setSenderAmount] = useState("100.00");
  const [recipientAmount, setRecipientAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const exchangeRate = Number.parseFloat(transactionInfo?.exchangeRate ?? "0");
  const feeUsd = (transactionInfo?.feeBrackets[0]?.fee ?? 0) / 100;
  const receiveCurrency = transactionInfo?.receiveCurrency.toUpperCase() ?? "";

  const syncRecipientFromSender = useCallback(
    (rawSender: string) => {
      const sender = parseAmount(rawSender);
      if (!exchangeRate) return;
      const recipient = sender * exchangeRate;
      setRecipientAmount(formatAmount(recipient));
    },
    [exchangeRate],
  );

  const loadCountry = useCallback(async (countryCode: string) => {
    setUpdating(true);
    setError(null);
    try {
      const res = await fetch(`/api/remesas/crossborder?country=${countryCode}`);
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setTransactionInfo(data.transactionInfo);
      setSelectedCountry(countryCode);
    } catch {
      setError("No pudimos actualizar la tasa para este país. Intenta de nuevo.");
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/remesas/crossborder");
        if (!res.ok) throw new Error("fetch failed");
        const data: CalculatorPayload = await res.json();
        if (cancelled) return;
        setCountries(data.countries);
        setTransactionInfo(data.transactionInfo);
        setSelectedCountry(data.defaultCountry);
      } catch {
        if (!cancelled) {
          setError("No pudimos cargar la calculadora. Revisa tu conexión e intenta de nuevo.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (exchangeRate > 0) {
      syncRecipientFromSender(senderAmount);
    }
  }, [exchangeRate, senderAmount, syncRecipientFromSender]);

  function handleSenderChange(value: string) {
    setSenderAmount(value);
    syncRecipientFromSender(value);
  }

  function handleSenderBlur() {
    const parsed = parseAmount(senderAmount);
    setSenderAmount(formatAmount(parsed));
    syncRecipientFromSender(formatAmount(parsed));
  }

  function handleRecipientChange(value: string) {
    setRecipientAmount(value);
    if (!exchangeRate) return;
    const parsed = parseAmount(value);
    setSenderAmount(formatAmount(parsed / exchangeRate));
  }

  function handleRecipientBlur() {
    const parsed = parseAmount(recipientAmount);
    setRecipientAmount(formatAmount(parsed));
    if (exchangeRate) {
      setSenderAmount(formatAmount(parsed / exchangeRate));
    }
  }

  if (loading) {
    return (
      <div className="remesas-calc remesas-calc--loading rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm text-slate-500">Cargando calculadora de remesas…</p>
      </div>
    );
  }

  if (error && !transactionInfo) {
    return (
      <div className="remesas-calc rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const selected = countries.find((c) => c.value === selectedCountry);

  return (
    <div className="remesas-calc not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-[#f7f8ff] to-white shadow-sm">
      <div className="border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4749B6]">
              Calculadora de remesas
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#0B0B13]">
              Estima cuánto recibirá tu familiar
            </h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            Promo permanente: 2 remesas gratis
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            País de destino
          </span>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-[#4749B6] focus:ring-2 disabled:opacity-60"
            value={selectedCountry}
            disabled={updating}
            onChange={(e) => void loadCountry(e.target.value)}
          >
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {countryFlag(country.value)} {country.label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Envías</span>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-14 text-sm font-medium text-slate-900 outline-none ring-[#4749B6] focus:ring-2"
                value={senderAmount}
                onChange={(e) => handleSenderChange(e.target.value)}
                onBlur={handleSenderBlur}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500">
                USD
              </span>
            </div>
          </label>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
            <span className="text-slate-500">Comisión bancaria habitual</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through">{formatUsd(feeUsd)}</span>
              <span className="rounded-full bg-[#4749B6]/10 px-2 py-0.5 text-xs font-semibold text-[#4749B6]">
                Primeros 2 envíos gratis
              </span>
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Monto a convertir</p>
              <p className="font-medium text-slate-900">${formatAmount(parseAmount(senderAmount))}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Tasa de cambio</p>
              <p className="font-medium text-slate-900">
                {updating ? "Actualizando…" : transactionInfo?.exchangeRate}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#4749B6]/20 bg-[#4749B6]/5 p-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              El destinatario recibe
            </span>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-16 text-sm font-semibold text-slate-900 outline-none ring-[#4749B6] focus:ring-2"
                value={recipientAmount}
                onChange={(e) => handleRecipientChange(e.target.value)}
                onBlur={handleRecipientBlur}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-500">
                {countryFlag(selectedCountry)} {receiveCurrency}
              </span>
            </div>
          </label>
        </div>

        {error && <p className="text-sm text-amber-700">{error}</p>}

        <p className="text-xs leading-relaxed text-slate-500">
          Tasas y comisiones referenciales según{" "}
          {selected ? `${countryFlag(selected.value)} ${selected.label}` : "el país seleccionado"}.
          La promo de <strong>2 remesas gratis</strong> aplica de forma permanente en tus primeros
          dos envíos. Confirma el monto final en la app antes de enviar.
        </p>
      </div>
    </div>
  );
}
