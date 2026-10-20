// Resume rendering engine (plan 6.1, 10, 11.1). A pure component: no hooks or browser APIs;
// the same component is used in the editor preview, for printing, on example resume pages
// (server HTML) and in the server PDF. Only the design definition decides the look — there is
// no template-specific code.
import { Fragment, type ReactNode } from "react";
import { resumeLabels } from "@/lib/resume/labels";
import type { SectionId, ResumeData, Personal } from "@/lib/resume/schema";
import {
  FONTS,
  PAPER_SIZES,
  headerBand,
  isInSidebar,
  hasSidebar,
  resolveDesign,
  type ResolvedDesign,
  type DesignDefinition,
} from "@/lib/resume/design";
import {
  linkText,
  safeUrl,
  paragraphs,
  lines,
  dateRange,
  commaList,
  richTextParts,
} from "@/lib/resume/utils";
import "./resume.css";

type Context = {
  v: ResumeData;
  d: ResolvedDesign;
  l: ReturnType<typeof resumeLabels>;
  noLinks: boolean;
  embedded: boolean;
};

function RichText({ text }: { text: string }) {
  return (
    <>
      {richTextParts(text).map((p, i) =>
        p.bold ? <strong key={i}>{p.text}</strong> : <Fragment key={i}>{p.text}</Fragment>,
      )}
    </>
  );
}

function Bullets({ text }: { text: string }) {
  const l = lines(text);
  if (!l.length) return null;
  return (
    <ul>
      {l.map((s, i) => (
        <li key={i}>
          <RichText text={s} />
        </li>
      ))}
    </ul>
  );
}

function ResumeLink({
  href,
  children,
  className,
  disabled,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** No links in small previews: the preview already sits inside an <a>/<button>. */
  disabled?: boolean;
}) {
  const url = disabled ? "" : safeUrl(href);
  return url ? (
    <a href={url} className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

/* --- Contact --- */

const ICONS: Record<string, ReactNode> = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  location: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16M12 10v6" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="resume-icon">
      {ICONS[name]}
    </svg>
  );
}

type ContactItem = { icon: string; text: string; href?: string };

function contactItems(p: Personal): ContactItem[] {
  const l: ContactItem[] = [];
  if (p.email) l.push({ icon: "email", text: p.email, href: "mailto:" + p.email.trim() });
  if (p.phone) l.push({ icon: "phone", text: p.phone, href: "tel:" + p.phone.replace(/[^\d+]/g, "") });
  if (p.location) l.push({ icon: "location", text: p.location });
  if (p.linkedin) l.push({ icon: "linkedin", text: linkText(p.linkedin), href: p.linkedin });
  if (p.github) l.push({ icon: "github", text: linkText(p.github), href: p.github });
  if (p.web) l.push({ icon: "web", text: linkText(p.web), href: p.web });
  return l;
}

/** In a narrow column, break an email at the "@" rather than mid-word. */
function Breakable({ text }: { text: string }) {
  const [before, ...after] = text.split("@");
  if (!after.length) return <>{text}</>;
  return (
    <>
      {before}@<wbr />
      {after.join("@")}
    </>
  );
}

function Photo({ p }: { p: Personal }) {
  // Must be a plain <img> for the resume, PDF and printing (next/image lazy-loads when printing).
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="resume-photo" src={p.photo} alt="" />;
}

function Header({ c, inSidebarLayout }: { c: Context; inSidebarLayout: boolean }) {
  const { v, d, l } = c;
  const p = v.personal;
  const extras = p.extras.filter((e) => e.label || e.value);
  const contact = inSidebarLayout ? [] : contactItems(p);
  return (
    <header className="resume-header">
      {!inSidebarLayout && d.showPhoto && p.photo && <Photo p={p} />}
      <div className="resume-header-text">
        {c.embedded ? (
          <p className="resume-name">{p.name || l.fullName}</p>
        ) : (
          <h1 className="resume-name">{p.name || l.fullName}</h1>
        )}
        {p.title && <p className="resume-title">{p.title}</p>}
        {contact.length > 0 && (
          <ul className="resume-contact">
            {contact.map((x) => (
              <li key={x.icon}>
                <Icon name={x.icon} />
                {x.href ? (
                  <ResumeLink disabled={c.noLinks} href={x.href}>
                    <Breakable text={x.text} />
                  </ResumeLink>
                ) : (
                  <span>{x.text}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {!inSidebarLayout && extras.length > 0 && (
          <p className="resume-extras">
            {extras.map((e, i) => (
              <span key={i}>
                <b>{e.label}:</b> {e.value}
              </span>
            ))}
          </p>
        )}
      </div>
    </header>
  );
}

function SidebarContact({ c }: { c: Context }) {
  const p = c.v.personal;
  const items = contactItems(p);
  const extras = p.extras.filter((e) => e.label || e.value);
  if (!items.length && !extras.length) return null;
  return (
    <section className="resume-section resume-section-contact">
      <h2>{c.l.sectionTitles.contact}</h2>
      <ul className="resume-side-contact">
        {items.map((x) => (
          <li key={x.icon}>
            <Icon name={x.icon} />
            <span>
              {x.href ? (
                <ResumeLink disabled={c.noLinks} href={x.href}>
                  <Breakable text={x.text} />
                </ResumeLink>
              ) : (
                x.text
              )}
            </span>
          </li>
        ))}
        {extras.map((e, i) => (
          <li key={"extra" + i}>
            <span>
              <span className="resume-extra-label">{e.label}</span>
              {e.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --- Sections --- */

function EntryHead({ start, date }: { start: ReactNode; date: string }) {
  return (
    <div className="resume-entry-head">
      <div>{start}</div>
      {date && <p className="resume-date">{date}</p>}
    </div>
  );
}

function sectionBody(id: SectionId, c: Context, inSidebar: boolean): ReactNode {
  const { v, d, l } = c;
  const visible = <K extends keyof ResumeData>(k: K) =>
    (v[k] as { hidden?: boolean }[]).filter((i) => !i.hidden) as ResumeData[K];

  switch (id) {
    case "summary":
      if (!v.summary.trim()) return null;
      return (
        <div className="resume-paragraphs">
          {paragraphs(v.summary).map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
      );
    case "interests":
      if (!v.interests.trim()) return null;
      return (
        <div className="resume-paragraphs">
          {paragraphs(v.interests).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "experience": {
      const list = visible("experience");
      if (!list.length) return null;
      return list.map((i) => {
        const sub = [i.company, i.location].filter(Boolean).join(" · ");
        return (
          <article key={i.id} className="resume-entry">
            <EntryHead
              start={
                <>
                  <h3>{i.position}</h3>
                  {sub && <p className="resume-company">{sub}</p>}
                </>
              }
              date={dateRange(i.start, i.end, i.current, l.present)}
            />
            {i.description && (
              <p className="resume-description">
                <RichText text={i.description} />
              </p>
            )}
            <Bullets text={i.bullets} />
          </article>
        );
      });
    }
    case "projects": {
      const list = visible("projects");
      if (!list.length) return null;
      return list.map((i) => (
        <article key={i.id} className="resume-entry short">
          <EntryHead
            start={
              <>
                <h3>
                  {i.link ? <ResumeLink disabled={c.noLinks} href={i.link}>{i.name}</ResumeLink> : i.name}
                  {i.role && <span className="resume-role"> · {i.role}</span>}
                </h3>
                {(i.technologies || i.link) && (
                  <p className="resume-tech">
                    {i.technologies}
                    {i.technologies && i.link && " · "}
                    {i.link && (
                      <ResumeLink disabled={c.noLinks} href={i.link} className="resume-link">
                        {linkText(i.link)}
                      </ResumeLink>
                    )}
                  </p>
                )}
              </>
            }
            date={dateRange(i.start, i.end || (i.start ? l.present : ""), false, l.present)}
          />
          {i.description && (
            <p className="resume-description">
              <RichText text={i.description} />
            </p>
          )}
          <Bullets text={i.bullets} />
        </article>
      ));
    }
    case "education": {
      const list = visible("education");
      if (!list.length) return null;
      return list.map((i) => {
        const sub = [i.field, i.degree].filter(Boolean).join(", ");
        const extra = [i.gpa ? `${l.gpa}: ${i.gpa}` : "", i.location].filter(Boolean).join(" · ");
        return (
          <article key={i.id} className="resume-entry short">
            <EntryHead
              start={
                <>
                  <h3>{i.school}</h3>
                  {sub && <p className="resume-company">{sub}</p>}
                </>
              }
              date={dateRange(i.start, i.end, false, l.present)}
            />
            {extra && <p className="resume-description">{extra}</p>}
            {i.description && (
              <p className="resume-description">
                <RichText text={i.description} />
              </p>
            )}
          </article>
        );
      });
    }
    case "skills": {
      const list = visible("skills").filter((i) => i.category || i.items);
      if (!list.length) return null;
      const style = inSidebar ? "list" : d.skills;
      if (style === "list")
        return (
          <dl className="resume-skills">
            {list.map((i) => (
              <div key={i.id}>
                <dt>{i.category}</dt>
                <dd>{commaList(i.items).join(", ")}</dd>
              </div>
            ))}
          </dl>
        );
      return (
        <div className={style === "two-column" ? "resume-skills-grid" : "resume-skills-flow"}>
          {list.map((i) => (
            <div key={i.id} className="resume-skill-group">
              {i.category && <h3>{i.category}</h3>}
              <p className="resume-tags">
                {commaList(i.items).map((e, j) => (
                  <Fragment key={j}>
                    {j > 0 && <span className="resume-hidden-separator">, </span>}
                    <span className="resume-tag">{e}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      );
    }
    case "certifications": {
      const list = visible("certifications").filter((i) => i.name);
      if (!list.length) return null;
      return (
        <ul className="resume-list">
          {list.map((i) => {
            const meta = [i.issuer, i.date].filter(Boolean).join(", ");
            return (
              <li key={i.id}>
                <strong>{i.link ? <ResumeLink disabled={c.noLinks} href={i.link}>{i.name}</ResumeLink> : i.name}</strong>
                {meta &&
                  (inSidebar ? (
                    <span className="resume-meta resume-block">{meta}</span>
                  ) : (
                    <span className="resume-meta"> — {meta}</span>
                  ))}
              </li>
            );
          })}
        </ul>
      );
    }
    case "languages": {
      const list = visible("languages").filter((i) => i.language);
      if (!list.length) return null;
      return (
        <ul className="resume-list">
          {list.map((i) => (
            <li key={i.id}>
              <strong>{i.language}</strong>
              {i.level &&
                (inSidebar ? (
                  <span className="resume-meta resume-block">{i.level}</span>
                ) : (
                  <span className="resume-meta"> — {i.level}</span>
                ))}
            </li>
          ))}
        </ul>
      );
    }
    case "references": {
      const list = visible("references").filter((i) => i.name);
      if (!list.length) return null;
      return (
        <div className="resume-references">
          {list.map((i) => {
            const title = [i.title, i.company].filter(Boolean).join(", ");
            return (
              <div key={i.id} className="resume-reference">
                <strong>{i.name}</strong>
                {title && <span>{title}</span>}
                {(i.phone || i.email) && (
                  <span>
                    {i.phone && (
                      <ResumeLink disabled={c.noLinks} href={"tel:" + i.phone.replace(/[^\d+]/g, "")}>
                        {i.phone}
                      </ResumeLink>
                    )}
                    {i.phone && i.email && " · "}
                    {i.email && (
                      <ResumeLink disabled={c.noLinks} href={"mailto:" + i.email}>
                        {i.email}
                      </ResumeLink>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }
}

function Section({ id, c, inSidebar }: { id: SectionId; c: Context; inSidebar: boolean }) {
  const body = sectionBody(id, c, inSidebar);
  if (!body) return null;
  const title = c.v.settings.sectionTitles[id]?.trim() || c.l.sectionTitles[id];
  return (
    <section className={`resume-section resume-section-${id}`}>
      <h2>{title}</h2>
      {body}
    </section>
  );
}

/* --- Document --- */

export function ResumeDocument({
  data,
  definition,
  className,
  noLinks = false,
  embedded = false,
}: {
  data: ResumeData;
  definition: DesignDefinition;
  className?: string;
  /** Renders links as plain text (small previews inside a clickable element). */
  noLinks?: boolean;
  /** Inside another page that has its own h1 (example pages, thumbnails): the name is not a heading. */
  embedded?: boolean;
}) {
  const d = resolveDesign(definition, data.settings);
  const l = resumeLabels(data.settings.locale);
  const c: Context = { v: data, d, l, noLinks, embedded };
  const paper = PAPER_SIZES[d.paper];
  const visible = data.settings.sectionOrder.filter((id) => !data.settings.hiddenSections.includes(id));
  const sidebarLayout = hasSidebar(d);
  const fullHeader = sidebarLayout && !!d.sidebar?.fullHeader;

  const style = {
    "--resume-accent": d.colors.accent,
    "--resume-text": d.colors.text,
    "--resume-muted": d.colors.muted,
    "--resume-border": d.colors.border,
    "--resume-font": FONTS[d.typography.font].css,
    "--resume-heading-font": d.typography.headingFont ? FONTS[d.typography.headingFont].css : undefined,
    "--resume-size": `${d.typography.size}pt`,
    "--resume-line-height": d.typography.lineHeight,
    "--resume-spacing": d.spacingFactor,
    "--resume-margin-top": `${d.margins.top}mm`,
    "--resume-margin-bottom": `${d.margins.bottom}mm`,
    "--resume-margin-x": `${d.margins.horizontal}mm`,
    "--resume-sidebar-width": d.sidebar ? `${d.sidebar.width}mm` : undefined,
    "--resume-page-width": `${paper.width}mm`,
    "--resume-page-height": `${paper.height}mm`,
    "--resume-separator": `"${d.separator}"`,
  } as React.CSSProperties;

  // Every visual difference is a data-* attribute; resume.css only looks at these.
  const dataAttributes = {
    "data-layout": d.layout,
    "data-align": d.header.align,
    "data-photo": d.header.photo,
    "data-divider": d.header.divider,
    "data-title": d.header.title,
    "data-name-color": d.header.nameColor,
    "data-name-size": d.header.nameSize ?? "medium",
    "data-name-style": d.header.nameStyle ?? "bold",
    "data-band": headerBand(d),
    "data-stripe": sidebarLayout ? "none" : (d.stripe ?? "none"),
    "data-heading": d.sectionHeading,
    "data-heading-case": d.headingCase ?? "uppercase",
    "data-section-layout": d.sectionLayout ?? "stacked",
    "data-bullets": d.bullets,
    "data-tag-style": d.tagStyle ?? "filled",
    "data-contact": d.contact,
    "data-company": d.company,
    "data-date": d.datePosition ?? "right",
    "data-timeline": d.timeline ? "yes" : "no",
    "data-sidebar-bg": sidebarLayout ? (d.sidebar?.background ?? "accent") : undefined,
    "data-full-header": fullHeader ? "yes" : undefined,
    "data-paper": d.paper,
  };

  let inner: ReactNode;
  if (sidebarLayout) {
    const side = visible.filter((id) => isInSidebar(d, id));
    const main = visible.filter((id) => !isInSidebar(d, id));
    inner = (
      <>
        {fullHeader && (
          <div className="resume-full-header">
            <Header c={c} inSidebarLayout={false} />
          </div>
        )}
        {/* The main column comes first in the DOM (ATS reading order); the grid moves the sidebar aside. */}
        <div className="resume-body">
          <div className="resume-main">
            {!fullHeader && <Header c={c} inSidebarLayout />}
            {main.map((id) => (
              <Section key={id} id={id} c={c} inSidebar={false} />
            ))}
          </div>
          <aside className="resume-side">
            {!fullHeader && d.showPhoto && data.personal.photo && <Photo p={data.personal} />}
            {!fullHeader && <SidebarContact c={c} />}
            {side.map((id) => (
              <Section key={id} id={id} c={c} inSidebar />
            ))}
          </aside>
        </div>
      </>
    );
  } else {
    inner = (
      <div className="resume-inner">
        <Header c={c} inSidebarLayout={false} />
        {visible.map((id) => (
          <Section key={id} id={id} c={c} inSidebar={false} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={className ? `resume ${className}` : "resume"}
      lang={data.settings.locale}
      dir={l.rtl ? "rtl" : "ltr"}
      style={style}
      {...dataAttributes}
    >
      <div className="resume-backdrop" aria-hidden="true" />
      <table className="resume-frame" role="presentation">
        <thead>
          <tr>
            <td>
              <div className="resume-space-top" />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="resume-content">{inner}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="resume-space-bottom" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
