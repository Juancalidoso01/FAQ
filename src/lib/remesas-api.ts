const REMESAS_API = "https://app.puntopago.net/api/v1/user/transactions/crossborder/inputs";

export type RemesasCountry = {
  label: string;
  value: string;
  isDefault?: boolean;
};

export type RemesasFeeBracket = {
  amountFrom: number;
  fee: number;
  tax: number;
};

export type RemesasTransactionInfo = {
  exchangeRate: string;
  receiveCurrency: string;
  feeBrackets: RemesasFeeBracket[];
};

type CountriesResponse = {
  result?: {
    fields?: Array<{
      options?: RemesasCountry[];
    }>;
  };
};

type TransactionResponse = {
  result?: {
    transactionInfo?: RemesasTransactionInfo;
  };
};

async function postCrossborder<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch(REMESAS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Remesas API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchRemesasCountries(): Promise<RemesasCountry[]> {
  const data = await postCrossborder<CountriesResponse>({
    _fields: "fields(options(label,value,isDefault))",
  });

  return data.result?.fields?.[0]?.options ?? [];
}

export async function fetchRemesasTransactionInfo(
  countryCode: string,
): Promise<RemesasTransactionInfo> {
  const data = await postCrossborder<TransactionResponse>({
    _fields: "transactionInfo(exchangeRate,receiveCurrency,feeBrackets(amountFrom,fee,tax))",
    fields: [{ name: "recipient_country", value: countryCode }],
  });

  const info = data.result?.transactionInfo;
  if (!info) {
    throw new Error("No transaction info returned");
  }

  return info;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(amount: number): string {
  const [whole, fraction = "00"] = amount.toFixed(2).split(".");
  return `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
}

export function parseAmount(value: string): number {
  const normalized = value.replace(/,/g, "").trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function countryFlag(code: string): string {
  const flags: Record<string, string> = {
    CO: "🇨🇴",
    DO: "🇩🇴",
    NI: "🇳🇮",
    PE: "🇵🇪",
    EC: "🇪🇨",
    SV: "🇸🇻",
    MX: "🇲🇽",
    ES: "🇪🇸",
  };
  return flags[code] ?? "🌎";
}
