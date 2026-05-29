export function ArticleContent({ html }: { html: string }) {
  return (
    <div
      className="faq-article prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
