// Yapılandırılmış veri (plan 6.4). `<` kaçışı, metinden script kapatılmasını önler.
export function JsonLd({ veri }: { veri: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(veri).replace(/</g, "\\u003c"),
      }}
    />
  );
}
