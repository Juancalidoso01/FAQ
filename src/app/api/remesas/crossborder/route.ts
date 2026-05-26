import { NextResponse } from "next/server";
import {
  fetchRemesasCountries,
  fetchRemesasTransactionInfo,
} from "@/lib/remesas-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");

  try {
    if (country) {
      const transactionInfo = await fetchRemesasTransactionInfo(country);
      return NextResponse.json({ transactionInfo });
    }

    const countries = await fetchRemesasCountries();
    const defaultCountry =
      countries.find((c) => c.isDefault)?.value ?? countries[0]?.value ?? "CO";
    const transactionInfo = await fetchRemesasTransactionInfo(defaultCountry);

    return NextResponse.json({ countries, transactionInfo, defaultCountry });
  } catch (error) {
    console.error("Remesas API proxy error:", error);
    return NextResponse.json(
      { error: "No se pudo cargar la información de remesas." },
      { status: 502 },
    );
  }
}
