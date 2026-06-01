"use client";

import { useState } from "react";
import { useT } from "@/components/T";

const SUPPORT_PHONE = "+507 399-3999";
const WHATSAPP_NUMBER = "+507 6825-2816";
const WHATSAPP_LINK = "https://wa.me/50768252816";

export function ArticleFeedback() {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const t = useT();

  return (
    <section aria-label={t("¿Te resultó útil esta guía?")} className="faq-feedback">
      {vote === null ? (
        <div className="faq-feedback__ask">
          <p className="faq-feedback__title">{t("¿Te resultó útil esta guía?")}</p>
          <div className="faq-feedback__buttons">
            <button type="button" onClick={() => setVote("up")} className="faq-feedback__btn">
              <span aria-hidden>👍</span> {t("Sí")}
            </button>
            <button type="button" onClick={() => setVote("down")} className="faq-feedback__btn">
              <span aria-hidden>👎</span> {t("No")}
            </button>
          </div>
        </div>
      ) : vote === "up" ? (
        <p className="faq-feedback__thanks">
          {t("¡Gracias por tu opinión! Nos ayuda a mejorar la guía.")}
        </p>
      ) : (
        <div className="faq-feedback__thanks">
          <p className="font-semibold text-[#0B0B13]">{t("Gracias por avisarnos.")}</p>
          <p className="mt-1 text-slate-600">
            {t("Si necesitas ayuda directa, escríbenos por")}{" "}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              WhatsApp {WHATSAPP_NUMBER}
            </a>{" "}
            {t("o llama al")} {SUPPORT_PHONE}.
          </p>
        </div>
      )}
    </section>
  );
}
