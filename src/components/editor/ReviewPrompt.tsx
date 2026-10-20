"use client";

import { Loader2, Star, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { submitReviewAction } from "@/actions/review";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { REVIEW_BODY_MAX, REVIEW_OCCUPATION_MAX } from "@/lib/reviews";
import { Checkbox, IconButton, Input, Textarea } from "./ui";

const DOWNLOADS_KEY = "freehandcv:pdf-downloads";
const ASKED_KEY = "freehandcv:review-asked";

/**
 * Called after each successful PDF download; true once the second one is done and the user hasn't
 * been asked yet in this browser (plan 6.3: ask at a satisfied moment, only once).
 */
export function shouldAskForReview() {
  try {
    if (localStorage.getItem(ASKED_KEY)) return false;
    const n = Number(localStorage.getItem(DOWNLOADS_KEY) || 0) + 1;
    localStorage.setItem(DOWNLOADS_KEY, String(n));
    return n >= 2;
  } catch {
    return false;
  }
}

function markAsked() {
  try {
    localStorage.setItem(ASKED_KEY, "1");
  } catch {}
}

export function ReviewPrompt({
  open,
  onClose,
  notify,
}: {
  open: boolean;
  onClose: () => void;
  notify: (text: string) => void;
}) {
  const t = useTranslations("Editor.review");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [occupation, setOccupation] = useState("");
  const [displayAllowed, setDisplayAllowed] = useState(false);
  const [sending, setSending] = useState(false);

  const close = () => {
    markAsked();
    onClose();
  };

  const send = async () => {
    setSending(true);
    const r = await submitReviewAction({ rating, body, occupation, displayAllowed: displayAllowed && !!body.trim() }).catch(
      () => ({ ok: false }),
    );
    setSending(false);
    if (!r.ok) return notify(t("error"));
    close();
    notify(t("thanks"));
  };

  return (
    <AnimatePresence>
      {open && (
        <m.section
          aria-labelledby="review-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
          className="fixed end-4 bottom-20 z-40 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-5 text-foreground shadow-elevated lg:bottom-6"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 id="review-title" className="font-bold">
              {t("title")}
            </h2>
            <IconButton label={t("close")} onClick={close} className="-me-2 -mt-2 size-8">
              <X className="size-4" />
            </IconButton>
          </div>

          <div role="radiogroup" aria-label={t("ratingLabel")} className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={t("stars", { n })}
                onClick={() => setRating(n)}
                className="grid size-10 place-items-center rounded-lg hover:bg-surface-2"
              >
                <Star className={cn("size-6", n <= rating ? "fill-warning text-warning" : "text-border-strong")} />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <Textarea
                value={body}
                maxLength={REVIEW_BODY_MAX}
                rows={3}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("bodyPlaceholder")}
                aria-label={t("bodyPlaceholder")}
              />
              <Input
                value={occupation}
                maxLength={REVIEW_OCCUPATION_MAX}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder={t("occupationPlaceholder")}
                aria-label={t("occupationPlaceholder")}
              />
              <Checkbox
                label={t("displayAllowed")}
                checked={displayAllowed}
                disabled={!body.trim()}
                onChange={setDisplayAllowed}
              />
              <div className="flex justify-end">
                <button type="submit" disabled={sending} className={buttonClass("secondary", "sm")}>
                  {sending && <Loader2 className="size-4 animate-spin" />}
                  {t("send")}
                </button>
              </div>
            </form>
          )}
        </m.section>
      )}
    </AnimatePresence>
  );
}
