"use client";

import { useState } from "react";
import { analysePaper, askPaper } from "@/lib/api";
import type {
  AnalysisResponse,
  AskResponse,
  AnalysisItem,
} from "@/types/rag";
import EvidenceCard from "@/components/research-rag/EvidenceCard";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const SUGGESTED_QUESTIONS = [
  "What is the research aim?",
  "What methods are discussed?",
  "What evidence is reviewed?",
  "What are the research directions?",
];

type CategoryFilter =
  | "all"
  | "found"
  | "partial"
  | "missing";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] =
    useState<AnalysisResponse | null>(null);

  function validateFile(selectedFile: File) {
    setError("");

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a PDF file.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("The PDF must be smaller than 25 MB.");
      return false;
    }

    return true;
  }

  function handleFile(selectedFile: File) {
    if (!validateFile(selectedFile)) {
      return;
    }

    setFile(selectedFile);
    setResult(null);
  }

  async function handleAnalyse() {
    if (!file) {
      return;
    }

    setAnalysing(true);
    setError("");

    try {
      const data = await analysePaper(file);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyse the PDF."
      );
    } finally {
      setAnalysing(false);
    }
  }

  function resetAnalysis() {
    setFile(null);
    setResult(null);
    setError("");
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-[#171717]">
      <header className="border-b border-black/[0.08] bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-semibold text-white shadow-sm">
              R
            </div>

            <div>
              <div className="text-sm font-semibold tracking-tight">
                Research Paper RAG
              </div>

              <div className="mt-0.5 text-[10px] text-black/40">
                Evidence intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[10px] font-medium text-black/45">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI research tool
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-14 lg:px-10 lg:pt-20">
        {!result ? (
          <Landing
            file={file}
            dragging={dragging}
            analysing={analysing}
            error={error}
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onFile={handleFile}
            onAnalyse={handleAnalyse}
          />
        ) : (
          <AnalysisDashboard
            result={result}
            file={file}
            onReset={resetAnalysis}
          />
        )}
      </section>
    </main>
  );
}

function Landing({
  file,
  dragging,
  analysing,
  error,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFile,
  onAnalyse,
}: {
  file: File | null;
  dragging: boolean;
  analysing: boolean;
  error: string;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;
  onFile: (file: File) => void;
  onAnalyse: () => void;
}) {
  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-24">
      <div>
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium text-black/45 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
          Research paper intelligence
        </div>

        <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-[5rem]">
          Turn a research paper into an
          <span className="text-black/40">
            {" "}
            evidence map.
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-[15px] leading-7 text-black/55">
          Analyse what a paper covers, what evidence supports
          it, which methods are discussed, and where the research
          points next.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <MiniFeature label="Evidence grounded" />
          <MiniFeature label="Section aware" />
          <MiniFeature label="Interactive analysis" />
        </div>
      </div>

      <div>
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            onDragEnter();
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            onDragLeave();
          }}
          onDrop={onDrop}
          className={`overflow-hidden rounded-3xl border bg-white shadow-[0_25px_80px_rgba(0,0,0,0.07)] transition ${
            dragging
              ? "border-black shadow-[0_25px_90px_rgba(0,0,0,0.12)]"
              : "border-black/[0.08]"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/[0.07] px-7 py-5">
            <div>
              <div className="text-sm font-semibold">
                Start an analysis
              </div>

              <div className="mt-1 text-xs text-black/40">
                Upload your research paper
              </div>
            </div>

            <div className="rounded-full bg-black px-3 py-1.5 text-[9px] font-semibold tracking-wider text-white">
              PDF
            </div>
          </div>

          <div className="p-7">
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0];

                if (selectedFile) {
                  onFile(selectedFile);
                }
              }}
            />

            <label
              htmlFor="pdf-upload"
              className={`flex min-h-[245px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition ${
                dragging
                  ? "border-black bg-[#f7f7f5]"
                  : "border-black/15 bg-[#fafaf8] hover:border-black/30 hover:bg-[#f6f6f3]"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-lg">
                ↑
              </div>

              <div className="mt-6 text-sm font-semibold">
                {file
                  ? file.name
                  : "Drop your paper here"}
              </div>

              <div className="mt-2 text-xs text-black/40">
                or click to choose a PDF
              </div>

              <div className="mt-5 rounded-full bg-white px-3 py-1.5 text-[9px] font-medium text-black/35 shadow-sm">
                Maximum file size · 25 MB
              </div>
            </label>

            {file && (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-black/10 bg-[#fafaf8] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-[10px] font-semibold text-white">
                  PDF
                </div>

                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold">
                    {file.name}
                  </div>

                  <div className="mt-1 text-[10px] text-black/40">
                    Ready to analyse
                  </div>
                </div>
              </div>
            )}

            {file && (
              <button
                type="button"
                onClick={onAnalyse}
                disabled={analysing}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {analysing ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/30 border-t-white" />
                    Mapping your paper...
                  </>
                ) : (
                  <>
                    Analyse paper
                    <span className="text-base">→</span>
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniFeature({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[10px] font-medium text-black/50 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-black/40" />
      {label}
    </div>
  );
}

function AnalysisDashboard({
  result,
  file,
  onReset,
}: {
  result: AnalysisResponse;
  file: File | null;
  onReset: () => void;
}) {
  const {
    filename,
    pages,
    chunks,
    categories,
    summary,
    evidence_gaps,
  } = result;

  const [filter, setFilter] =
    useState<CategoryFilter>("all");

  const foundPercentage =
    summary.total_categories > 0
      ? Math.round(
          (summary.found /
            summary.total_categories) *
            100
        )
      : 0;

  const filteredCategories =
    filter === "all"
      ? categories
      : categories.filter(
          (category) =>
            category.status === filter
        );

  return (
    <div>
      {/* Analysis header */}
      <section className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.05)]">
        <div className="relative overflow-hidden bg-black px-7 py-9 text-white sm:px-10 sm:py-11">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/[0.06]" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-4xl">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Analysis complete
              </div>

              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Your paper, mapped.
              </h1>

              <p className="mt-4 max-w-3xl truncate text-sm text-white/55 sm:text-base">
                {filename}
              </p>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-white/15"
            >
              Analyse another
            </button>
          </div>
        </div>

        {/* Paper profile */}
        <div className="border-b border-black/10 p-7 sm:p-9">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Paper profile
              </div>

              <div className="mt-1 text-xs text-black/40">
                Overview of the material processed for this analysis.
              </div>
            </div>

            <div className="hidden rounded-full bg-[#f5f5f2] px-3 py-1.5 text-[9px] font-medium text-black/40 sm:block">
              {summary.total_categories} dimensions
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ProfileMetric
              value={String(pages)}
              label="Pages"
            />

            <ProfileMetric
              value={String(chunks)}
              label="Text chunks"
            />

            <ProfileMetric
              value={String(summary.total_categories)}
              label="Dimensions"
            />

            <ProfileMetric
              value={String(evidence_gaps.length)}
              label="Evidence gaps"
            />
          </div>
        </div>

        {/* Coverage */}
        <div className="grid lg:grid-cols-[1fr_310px]">
          <div className="p-7 sm:p-9">
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  Evidence coverage
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
                  How much of the analysed structure has supporting
                  evidence.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <CoveragePill
                    label="Found"
                    value={summary.found}
                  />

                  <CoveragePill
                    label="Partial"
                    value={summary.partial}
                  />

                  <CoveragePill
                    label="Missing"
                    value={summary.missing}
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-5">
                <CoverageRing
                  percentage={summary.evidence_coverage}
                  large
                />

                <div>
                  <div className="text-3xl font-semibold tracking-[-0.04em]">
                    {summary.evidence_coverage}%
                  </div>

                  <div className="mt-1 text-[10px] text-black/35">
                    evidence coverage
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-black/[0.07]">
              <div
                className="h-full rounded-full bg-black transition-all duration-700"
                style={{
                  width: `${summary.evidence_coverage}%`,
                }}
              />
            </div>
          </div>

          <div className="border-t border-black/10 bg-[#fafaf8] p-7 lg:border-l lg:border-t-0 sm:p-9">
            <div className="text-sm font-semibold tracking-tight">
              Analysis snapshot
            </div>

            <div className="mt-5 flex items-center gap-5">
              <CoverageRing
                percentage={foundPercentage}
              />

              <div>
                <div className="text-2xl font-semibold tracking-tight">
                  {summary.found}
                  <span className="text-black/25">
                    {" "}
                    / {summary.total_categories}
                  </span>
                </div>

                <div className="mt-1 text-xs text-black/45">
                  clearly identified
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <SnapshotRow
                label="Found"
                value={summary.found}
              />

              <SnapshotRow
                label="Partial"
                value={summary.partial}
              />

              <SnapshotRow
                label="Missing"
                value={summary.missing}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research map */}
      <section className="mt-14">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
              Research map
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              What the paper contains
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
              Explore the evidence found across the main dimensions
              of the paper.
            </p>
          </div>

          <div className="text-xs text-black/35">
            {filteredCategories.length} of {categories.length} shown
          </div>
        </div>

        {/* Visual map overview */}
        <ResearchMapOverview
          categories={categories}
        />

        {/* Filters */}
        <div className="mb-6 mt-10 flex flex-wrap items-center gap-2">
          <FilterButton
            label="All"
            count={categories.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />

          <FilterButton
            label="Found"
            count={summary.found}
            active={filter === "found"}
            onClick={() => setFilter("found")}
          />

          <FilterButton
            label="Partial"
            count={summary.partial}
            active={filter === "partial"}
            onClick={() => setFilter("partial")}
          />

          <FilterButton
            label="Missing"
            count={summary.missing}
            active={filter === "missing"}
            onClick={() => setFilter("missing")}
          />
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredCategories.map(
              (category: AnalysisItem) => {
                const originalIndex =
                  categories.findIndex(
                    (item) =>
                      item.category ===
                      category.category
                  );

                return (
                  <EvidenceCard
                    key={category.category}
                    item={category}
                    number={originalIndex + 1}
                  />
                );
              }
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white px-6 py-12 text-center">
            <div className="text-sm font-semibold">
              No dimensions match this filter.
            </div>

            <div className="mt-2 text-xs text-black/40">
              Try another evidence status.
            </div>
          </div>
        )}
      </section>

      {/* Evidence gaps */}
      <section className="mt-14">
        <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-black/10 px-7 py-7 sm:flex-row sm:items-end sm:px-9">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                Evidence gaps
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                What needs more evidence?
              </h2>
            </div>

            <div className="rounded-full bg-[#f5f5f2] px-3 py-1.5 text-[10px] font-medium text-black/45">
              {evidence_gaps.length} identified
            </div>
          </div>

          <div className="p-7 sm:p-9">
            {evidence_gaps.length === 0 ? (
              <div className="flex items-center gap-4 rounded-2xl bg-[#f7f7f5] px-5 py-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm text-white">
                  ✓
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    No evidence gaps identified
                  </div>

                  <div className="mt-1 text-xs text-black/40">
                    The analysis did not flag any missing evidence areas.
                  </div>
                </div>
              </div>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {evidence_gaps.map((gap) => (
                  <li
                    key={gap}
                    className="rounded-2xl border border-black/10 bg-[#fafaf8] px-5 py-4 text-sm leading-6 text-black/65"
                  >
                    {gap}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <AskThePaper file={file} />

      <footer className="mt-10 border-t border-black/10 pt-6">
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[9px] uppercase tracking-[0.13em] text-black/30">
          <span>
            Analysis ID{" "}
            <span className="normal-case tracking-normal text-black/55">
              {result.id}
            </span>
          </span>

          <span>
            Applicable{" "}
            <span className="text-black/55">
              {summary.applicable_categories}
            </span>
          </span>

          <span>
            Not applicable{" "}
            <span className="text-black/55">
              {summary.not_applicable}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Research Map                                                        */
/* -------------------------------------------------------------------------- */

function ResearchMapOverview({
  categories,
}: {
  categories: AnalysisItem[];
}) {
  const aim = categories[0] ?? null;
  const concepts = categories[1] ?? null;
  const theory = categories[2] ?? null;
  const areas = categories[3] ?? null;
  const methods = categories[4] ?? null;
  const evidence = categories[5] ?? null;
  const conclusions = categories[6] ?? null;

  return (
    <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-5 sm:p-8">
      {/* Desktop map */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-5xl">
          {/* Paper node */}
          <div className="flex justify-center">
            <MapNode
              label="Paper"
              subtitle="Analysed document"
              central
            />
          </div>

          {/* Connection */}
          <div className="mx-auto h-8 w-px bg-black/10" />

          {/* First dimension row */}
          <div className="relative">
            <div className="absolute left-[16.66%] right-[16.66%] top-0 h-px bg-black/10" />

            <div className="grid grid-cols-3 gap-5">
              <div className="relative pt-5">
                <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-black/10" />

                <MapNode
                  category={aim}
                  fallbackLabel="Research Aim / Scope"
                />
              </div>

              <div className="relative pt-5">
                <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-black/10" />

                <MapNode
                  category={concepts}
                  fallbackLabel="Key Concepts / Definitions"
                />
              </div>

              <div className="relative pt-5">
                <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-black/10" />

                <MapNode
                  category={theory}
                  fallbackLabel="Theoretical Framework"
                />
              </div>
            </div>
          </div>

          {/* Connection */}
          <div className="mx-auto h-8 w-px bg-black/10" />

          {/* Methods / evidence */}
          <div className="grid grid-cols-2 gap-5">
            <MapNode
              category={methods}
              fallbackLabel="Methods Discussed"
            />

            <MapNode
              category={evidence}
              fallbackLabel="Evidence / Studies Reviewed"
            />
          </div>

          {/* Connection */}
          <div className="mx-auto h-8 w-px bg-black/10" />

          {/* Areas / conclusions */}
          <div className="grid grid-cols-2 gap-5">
            <MapNode
              category={areas}
              fallbackLabel="Research Areas / Themes"
            />

            <MapNode
              category={conclusions}
              fallbackLabel="Conclusions / Research Directions"
            />
          </div>
        </div>
      </div>

      {/* Mobile / tablet map */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <MapNode
            label="Paper"
            subtitle="Analysed document"
            central
          />
        </div>

        <div className="mx-auto my-5 h-6 w-px bg-black/10" />

        <div className="grid gap-3 sm:grid-cols-2">
          <MapNode
            category={aim}
            fallbackLabel="Research Aim / Scope"
          />

          <MapNode
            category={concepts}
            fallbackLabel="Key Concepts / Definitions"
          />

          <MapNode
            category={theory}
            fallbackLabel="Theoretical Framework"
          />

          <MapNode
            category={areas}
            fallbackLabel="Research Areas / Themes"
          />

          <MapNode
            category={methods}
            fallbackLabel="Methods Discussed"
          />

          <MapNode
            category={evidence}
            fallbackLabel="Evidence / Studies Reviewed"
          />

          <MapNode
            category={conclusions}
            fallbackLabel="Conclusions / Research Directions"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-black/[0.06] pt-5">
        <p className="text-center text-[11px] leading-5 text-black/30">
          Structural overview of the dimensions analysed by the
          retrieval system. The connections are visual grouping
          rather than claims about causal relationships within
          the research.
        </p>
      </div>
    </div>
  );
}

function MapNode({
  category,
  fallbackLabel,
  label,
  subtitle,
  central = false,
}: {
  category?: AnalysisItem | null;
  fallbackLabel?: string;
  label?: string;
  subtitle?: string;
  central?: boolean;
}) {
  const title =
    category?.category ??
    fallbackLabel ??
    label ??
    "Paper";

  const status = category?.status ?? "partial";
  const score = category?.score ?? null;

  const statusLabel =
    status === "found"
      ? "Found"
      : status === "partial"
        ? "Partial"
        : status === "missing"
          ? "Missing"
          : "N/A";

  const statusDot =
    status === "found"
      ? "bg-black"
      : status === "partial"
        ? "bg-black/35"
        : "bg-black/15";

  return (
    <div
      className={`rounded-2xl border transition ${
        central
          ? "border-black bg-black px-7 py-5 text-white shadow-[0_10px_35px_rgba(0,0,0,0.10)]"
          : "border-black/[0.08] bg-[#fafaf8] px-5 py-4 hover:border-black/15 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className={`flex items-center gap-2 ${
              central ? "text-white" : "text-black"
            }`}
          >
            {!central && (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${statusDot}`}
              />
            )}

            <div
              className={`truncate text-sm font-semibold tracking-[-0.02em] ${
                central ? "text-base" : ""
              }`}
            >
              {title}
            </div>
          </div>

          {(subtitle || category?.section) && (
            <div
              className={`mt-1 text-[10px] ${
                central
                  ? "text-white/40"
                  : "text-black/30"
              }`}
            >
              {subtitle || category?.section}
            </div>
          )}
        </div>

        {!central && category && (
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.10em] text-black/35">
            {statusLabel}
          </span>
        )}
      </div>

      {!central && category && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-black/25">
              Evidence strength
            </span>

            <span className="text-[10px] font-semibold text-black/45">
              {score !== null
                ? score.toFixed(2)
                : "—"}
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.07]">
            <div
              className="h-full rounded-full bg-black/55"
              style={{
                width: `${Math.max(
                  Math.min((score ?? 0) * 100, 100),
                  3
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#fafaf8] p-5">
      <div className="text-2xl font-semibold tracking-[-0.04em]">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-black/35">
        {label}
      </div>
    </div>
  );
}

function CoveragePill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-black/40" />

      <span className="text-[10px] text-black/45">
        {label}
      </span>

      <span className="text-[10px] font-semibold">
        {value}
      </span>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
        active
          ? "border-black bg-black text-white shadow-sm"
          : "border-black/10 bg-white text-black/50 hover:border-black/25 hover:text-black"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
          active
            ? "bg-white/15 text-white"
            : "bg-black/[0.05] text-black/35"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function SnapshotRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-black/45">{label}</span>

      <span className="font-semibold text-black/70">
        {value}
      </span>
    </div>
  );
}

function CoverageRing({
  percentage,
  large = false,
}: {
  percentage: number;
  large?: boolean;
}) {
  const radius = large ? 30 : 26;
  const circumference = 2 * Math.PI * radius;

  const safePercentage = Math.max(
    0,
    Math.min(percentage, 100)
  );

  const offset =
    circumference -
    (safePercentage / 100) * circumference;

  const size = large ? 82 : 72;

  return (
    <div
      className="relative shrink-0"
      style={{
        height: size,
        width: size,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-full w-full -rotate-90"
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-black/10"
        />

        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-black"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {percentage}%
      </div>
    </div>
  );
}

function AskThePaper({
  file,
}: {
  file: File | null;
}) {
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] =
    useState<AskResponse | null>(null);

  async function handleAsk() {
    if (!file || !question.trim()) {
      return;
    }

    setAsking(true);
    setError("");
    setResponse(null);

    try {
      const data = await askPaper(
        file,
        question.trim()
      );

      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to answer the question."
      );
    } finally {
      setAsking(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      (event.metaKey || event.ctrlKey)
    ) {
      event.preventDefault();
      handleAsk();
    }
  }

  function selectQuestion(
    suggestedQuestion: string
  ) {
    setQuestion(suggestedQuestion);
    setError("");
    setResponse(null);
  }

  return (
    <section className="mt-14">
      <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-black text-white shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden px-7 py-8 sm:px-9 sm:py-10">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/[0.07]" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-black">
                ?
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Ask the Paper
              </div>
            </div>

            <h2 className="mt-5 max-w-2xl text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Go deeper into the research.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Ask a question and retrieve the passages that
              support the answer.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 text-black sm:p-8">
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="paper-question"
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40"
            >
              Ask about this paper
            </label>

            <span className="text-[10px] text-black/25">
              {question.length}
            </span>
          </div>

          <textarea
            id="paper-question"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="What would you like to know?"
            rows={4}
            className="w-full resize-none rounded-2xl border border-black/10 bg-[#f7f7f5] px-5 py-4 text-sm leading-6 outline-none transition placeholder:text-black/25 focus:border-black/30 focus:bg-white"
          />

          <div className="mt-6">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/35">
              Try asking
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map(
                (suggestedQuestion) => (
                  <button
                    key={suggestedQuestion}
                    type="button"
                    onClick={() =>
                      selectQuestion(
                        suggestedQuestion
                      )
                    }
                    className={`rounded-full border px-4 py-2.5 text-xs transition ${
                      question === suggestedQuestion
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/55 hover:border-black/25 hover:text-black"
                    }`}
                  >
                    {suggestedQuestion}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-black/10 pt-5 sm:flex-row sm:items-center">
            <span className="text-[10px] text-black/30">
              Ctrl/Cmd + Enter to submit
            </span>

            <button
              type="button"
              onClick={handleAsk}
              disabled={
                asking ||
                !question.trim() ||
                !file
              }
              className="flex items-center justify-center gap-3 rounded-xl bg-black px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-black/85 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30"
            >
              {asking ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                  Finding evidence
                </>
              ) : (
                <>
                  Ask the paper
                  <span className="text-sm">→</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {response && (
            <div className="mt-9 border-t border-black/10 pt-8">
              <div className="rounded-2xl border border-black/10 bg-[#f8f8f6] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                    A
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                    Answer
                  </div>
                </div>

                <div className="mt-5 max-w-4xl text-[15px] leading-7 text-black/75">
                  {response.answer}
                </div>
              </div>

              {response.evidence.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-end justify-between border-b border-black/10 pb-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/40">
                        Supporting evidence
                      </div>

                      <div className="mt-1 text-xs text-black/40">
                        Retrieved passages supporting the answer.
                      </div>
                    </div>

                    <div className="text-[10px] font-medium text-black/30">
                      {response.evidence.length} sources
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {response.evidence.map(
                      (evidence, index) => (
                        <div
                          key={`${evidence.page}-${index}`}
                          className="rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/20 hover:shadow-sm"
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-black/40">
                              <span className="rounded-full bg-black px-2.5 py-1 text-white">
                                Source {index + 1}
                              </span>

                              <span>
                                Page {evidence.page}
                              </span>

                              {evidence.section && (
                                <>
                                  <span className="text-black/20">
                                    /
                                  </span>

                                  <span>
                                    {evidence.section}
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="text-[9px] uppercase tracking-[0.13em] text-black/25">
                              Score{" "}
                              {evidence.score.toFixed(3)}
                            </div>
                          </div>

                          <p className="mt-5 text-sm leading-7 text-black/65">
                            {evidence.text}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}