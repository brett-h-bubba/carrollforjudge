"use client";

import { useRef } from "react";
import type { Endorsement, EndorsementCategory } from "@/lib/supabase";

function categoryLabel(category: EndorsementCategory | null): string {
  switch (category) {
    case "former_client":          return "Former Client";
    case "professional_reference": return "Professional Reference";
    case "community_leader":       return "Community Leader";
    case "fellow_attorney":        return "Fellow Attorney";
    case "friend_family":          return "Friend of the Campaign";
    default:                       return "Supporter";
  }
}

export function EndorsementCard({ endorsement: e }: { endorsement: Endorsement }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headline = e.zinger?.trim() || null;
  const fullText = e.endorsement.trim();
  const isFeatured = e.featured;

  // Preview shown on the card: zinger if present, otherwise a trimmed excerpt
  const preview =
    headline ||
    (fullText.length > 140 ? fullText.slice(0, 140).trimEnd() + "..." : fullText);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  // Click outside the inner panel closes the dialog
  const onDialogClick = (evt: React.MouseEvent<HTMLDialogElement>) => {
    if (evt.target === dialogRef.current) close();
  };

  return (
    <>
      <article
        id={`endorsement-${e.id}`}
        role="button"
        tabIndex={0}
        aria-label={`Read full endorsement from ${e.name}`}
        onClick={open}
        onKeyDown={(evt) => {
          if (evt.key === "Enter" || evt.key === " ") {
            evt.preventDefault();
            open();
          }
        }}
        className={`group bg-white flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          isFeatured ? "ring-1 ring-gold/30" : "border-l-4 border-gold"
        }`}
      >
        {isFeatured && (
          <div className="bg-gold text-teal-dark px-7 py-2 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-2">
            <span aria-hidden="true">✦</span> Featured Endorsement
          </div>
        )}

        <div className="p-7 sm:p-8 flex flex-col flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-5 text-xs">
            <span className="text-gold font-semibold uppercase tracking-[0.25em]">
              {categoryLabel(e.category)}
            </span>
            {e.location && (
              <>
                <span className="text-slate-light" aria-hidden="true">·</span>
                <span className="text-slate-light uppercase tracking-[0.2em]">
                  {e.location}
                </span>
              </>
            )}
          </div>

          <blockquote className="text-xl sm:text-2xl text-teal-dark font-semibold italic leading-snug mb-6 flex-1">
            &ldquo;{preview}&rdquo;
          </blockquote>

          <cite className="pt-5 border-t border-cream-dark not-italic flex items-center justify-between gap-3">
            <span className="flex items-baseline gap-2">
              <span className="text-slate-light" aria-hidden="true">-</span>
              <span className="font-semibold text-teal-dark">{e.name}</span>
            </span>
            <span className="text-[11px] text-gold font-semibold tracking-[0.25em] uppercase group-hover:underline">
              Read more &rarr;
            </span>
          </cite>
        </div>
      </article>

      <dialog
        ref={dialogRef}
        onClick={onDialogClick}
        aria-labelledby={`endorsement-dialog-${e.id}-name`}
        className="m-auto p-0 max-w-xl w-[90vw] bg-transparent backdrop:bg-teal-dark/70 backdrop:backdrop-blur-sm"
      >
        <div className="bg-white shadow-2xl border-t-4 border-gold max-h-[85vh] overflow-y-auto">
          {isFeatured && (
            <div className="bg-gold text-teal-dark px-7 py-2 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-2">
              <span aria-hidden="true">✦</span> Featured Endorsement
            </div>
          )}

          <div className="p-8 sm:p-10 relative">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-slate-light hover:text-teal-dark text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              ×
            </button>

            <div className="flex items-center gap-2 flex-wrap mb-5 text-xs pr-8">
              <span className="text-gold font-semibold uppercase tracking-[0.25em]">
                {categoryLabel(e.category)}
              </span>
              {e.location && (
                <>
                  <span className="text-slate-light" aria-hidden="true">·</span>
                  <span className="text-slate-light uppercase tracking-[0.2em]">
                    {e.location}
                  </span>
                </>
              )}
            </div>

            {headline && (
              <blockquote className="text-xl sm:text-2xl text-teal-dark font-semibold italic leading-snug mb-6">
                &ldquo;{headline}&rdquo;
              </blockquote>
            )}

            <p className="text-slate leading-relaxed text-[15px] whitespace-pre-line mb-6">
              {fullText}
            </p>

            <cite
              id={`endorsement-dialog-${e.id}-name`}
              className="pt-5 border-t border-cream-dark not-italic flex items-baseline gap-2"
            >
              <span className="text-slate-light" aria-hidden="true">-</span>
              <span className="font-semibold text-teal-dark">{e.name}</span>
            </cite>
          </div>
        </div>
      </dialog>
    </>
  );
}
