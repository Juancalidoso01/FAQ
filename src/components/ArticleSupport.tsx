import { T } from "@/components/T";

const SUPPORT_PHONE = "+507 399-3999";
const WHATSAPP_NUMBER = "+507 6245-6852";
const WHATSAPP_LINK = "https://wa.me/50762456852";

export function ArticleSupport() {
  return (
    <aside className="faq-support" aria-label="Soporte Punto Pago">
      <div className="faq-support__icon" aria-hidden>
        💬
      </div>
      <div className="faq-support__body">
        <p className="faq-support__title">
          <T>¿Necesitas más ayuda?</T>
        </p>
        <p className="faq-support__text">
          <T>Nuestro equipo de soporte está disponible para resolver tus dudas.</T>
        </p>
      </div>
      <div className="faq-support__actions">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="faq-support__btn faq-support__btn--primary"
        >
          WhatsApp {WHATSAPP_NUMBER}
        </a>
        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="faq-support__btn">
          <T>Llamar</T> {SUPPORT_PHONE}
        </a>
      </div>
    </aside>
  );
}
