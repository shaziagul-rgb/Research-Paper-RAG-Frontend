"use client";

import { useState } from "react";
import type { AnalysisItem } from "@/types/rag";

interface EvidenceCardProps {
  item: AnalysisItem;
  number: number;
}

export default function EvidenceCard({
  item,
  number,
}: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAlternatives, setShowAlternatives] =
    useState(false);

  const score =
    item.score !== null ? item.score : 0;

  const scoreLabel =
    item.score !== null
      ? item.score.toFixed(2)
      : "—";

  const confidence =
    item.confidence
      ? item.confidence.charAt(0).toUpperCase() +
        item.confidence.slice(1)
      : "None";

  const statusLabel =
    item.status === "found"
      ? "Found"
      : item.status === "partial"
        ? "Partial"
        : item.status === "missing"
          ? "Missing"
          : "Not applicable";

  const statusDot =
    item.status === "found"
      ? "bg-black"
      : item.status === "partial"
        ? "bg-black/35"
        : "bg-black/15";

  const statusBackground =
    item.status === "found"
      ? "bg-black text-white"
      : item.status === "partial"
        ? "bg-[#ecece8] text-black/65"
        : "border border-black/10 bg-white text-black/40";

  const confidenceWidth =
    confidence.toLowerCase() === "high"
      ? 100
      : confidence.toLowerCase() === "moderate"
        ? 65
        : confidence.toLowerCase() === "low"
          ? 35
          : 10;

  const evidencePreview =
    item.evidence && item.evidence.length > 260
      ? `${item.evidence.slice(0, 260).trim()}…`
      : item.evidence;

  return (
    <article className="group overflow-hidden rounded-2xl border border-black/[0.08] bg-white transition duration-300 hover:border-black/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
      <div className="p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-5">
          {/* Number */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f0] text-[11px] font-semibold text-black/40">
            {String(number).padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${statusDot}`}
                  />

                  <h3 className="text-base font-semibold tracking-[-0.02em] sm:text-lg">
                    {item.category}
                  </h3>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${statusBackground}`}
                  >
                    {statusLabel}
                  </span>

                  <span className="text-[11px] text-black/35">
                    {confidence} confidence
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-0">
                <div className="text-2xl font-semibold leading-none tracking-[-0.04em]">
                  {scoreLabel}
                </div>

                <div className="text-[9px] uppercase tracking-[0.12em] text-black/30 sm:mt-1">
                  Evidence strength
                </div>
              </div>
            </div>

            {/* Confidence indicator */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.12em] text-black/25">
                  Confidence
                </span>

                <span className="text-[9px] text-black/25">
                  {confidence}
                </span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.07]">
                <div
                  className="h-full rounded-full bg-black/65 transition-all duration-500"
                  style={{
                    width: `${confidenceWidth}%`,
                  }}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {item.page !== null && (
                <div className="rounded-lg bg-[#f7f7f5] px-3 py-2 text-[10px] text-black/50">
                  <span className="text-black/30">
                    Page
                  </span>{" "}
                  <span className="font-semibold text-black/65">
                    {item.page}
                  </span>
                </div>
              )}

              {item.section && (
                <div className="max-w-full truncate rounded-lg bg-[#f7f7f5] px-3 py-2 text-[10px] text-black/50">
                  <span className="text-black/30">
                    Section
                  </span>{" "}
                  <span className="font-semibold text-black/65">
                    {item.section}
                  </span>
                </div>
              )}
            </div>

            {/* Compact evidence preview */}
            {item.evidence && (
              <div className="mt-5 rounded-xl bg-[#fafaf8] px-4 py-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black/30" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">
                    Evidence preview
                  </span>
                </div>

                <p className="text-xs leading-6 text-black/55">
                  {expanded
                    ? item.evidence
                    : evidencePreview}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setExpanded(!expanded)
                  }
                  className="mt-3 text-[10px] font-semibold text-black/45 transition hover:text-black"
                >
                  {expanded
                    ? "Hide evidence ↑"
                    : "View full evidence →"}
                </button>
              </div>
            )}

            {/* Alternative sources */}
            {item.alternatives.length > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setShowAlternatives(
                      !showAlternatives
                    )
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-black/[0.08] px-4 py-3 transition hover:bg-[#fafaf8]"
                >
                  <div className="text-left">
                    <div className="text-[11px] font-semibold text-black/65">
                      More evidence
                    </div>

                    <div className="mt-0.5 text-[9px] text-black/30">
                      {item.alternatives.length} alternative{" "}
                      {item.alternatives.length === 1
                        ? "source"
                        : "sources"}{" "}
                      found
                    </div>
                  </div>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f3f0] text-sm text-black/45">
                    {showAlternatives ? "−" : "+"}
                  </span>
                </button>

                {showAlternatives && (
                  <div className="mt-3 space-y-2">
                    {item.alternatives.map(
                      (alternative, index) => (
                        <div
                          key={`${alternative.page}-${index}`}
                          className="rounded-xl bg-[#fafaf8] p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.11em] text-black/30">
                            <span>
                              Source {index + 1}
                            </span>

                            <span className="text-black/15">
                              •
                            </span>

                            <span>
                              Page {alternative.page}
                            </span>

                            {alternative.section && (
                              <>
                                <span className="text-black/15">
                                  •
                                </span>

                                <span>
                                  {alternative.section}
                                </span>
                              </>
                            )}

                            <span className="text-black/15">
                              •
                            </span>

                            <span>
                              {alternative.score.toFixed(
                                2
                              )}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-6 text-black/55">
                            {alternative.text}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence strength indicator */}
      <div className="h-1 bg-black/[0.04]">
        <div
          className="h-full bg-black/60 transition-all duration-500"
          style={{
            width: `${Math.max(
              Math.min(score * 100, 100),
              3
            )}%`,
          }}
        />
      </div>
    </article>
  );
}