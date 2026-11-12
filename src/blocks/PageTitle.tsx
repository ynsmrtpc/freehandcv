// Intro for pages other than the landing; holds the page's single h1 (plan 6.4).
// The CMS eyebrow is stored but not rendered: the heading carries its own weight.
export function PageTitle({
  content,
  reading = false,
}: {
  content: { eyebrow: string; title: string; description: string };
  reading?: boolean;
}) {
  if (reading)
    return (
      <header className="border-b border-border pb-7">
        <h1 className="text-3xl leading-tight font-bold tracking-[-0.025em] text-pretty text-foreground sm:text-4xl">
          {content.title}
        </h1>
        {content.description && (
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {content.description}
          </p>
        )}
      </header>
    );
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
      <div className="border-b border-border pb-7">
        <h1 className="max-w-3xl text-3xl leading-tight font-bold tracking-[-0.025em] text-pretty text-foreground sm:text-4xl">
          {content.title}
        </h1>
        {content.description && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            {content.description}
          </p>
        )}
      </div>
    </section>
  );
}
