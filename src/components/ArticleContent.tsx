import { renderArticleContent } from "@/lib/content";

export function ArticleContent({ content }: { content: string }) {
  const html = renderArticleContent(content);

  return (
    <div
      className="faq-article prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
