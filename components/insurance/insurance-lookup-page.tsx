"use client";

import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export function InsuranceLookupPage() {
  const navigate = useNavigate();
  const [policyBusinessKey, setPolicyBusinessKey] = useState("");
  const [quoteBusinessKey, setQuoteBusinessKey] = useState("");
  const [quoteRevisionNumber, setQuoteRevisionNumber] = useState("");
  const normalizedPolicyBusinessKey = policyBusinessKey.trim().toUpperCase();
  const normalizedQuoteBusinessKey = quoteBusinessKey.trim().toUpperCase();
  const normalizedQuoteRevisionNumber = quoteRevisionNumber.trim();
  const canLoadPolicy = Boolean(normalizedPolicyBusinessKey);
  const canLoadQuote =
    Boolean(normalizedQuoteBusinessKey) &&
    Boolean(normalizedQuoteRevisionNumber);

  function handlePolicySubmit(event: FormEvent) {
    event.preventDefault();

    if (!canLoadPolicy) return;

    navigate({
      to: "/policies/$businessKey",
      params: { businessKey: normalizedPolicyBusinessKey },
    });
  }

  function handleQuoteSubmit(event: FormEvent) {
    event.preventDefault();

    if (!canLoadQuote) return;

    navigate({
      to: "/quotes/$businessKey",
      params: { businessKey: normalizedQuoteBusinessKey },
      search: { revisionNumber: normalizedQuoteRevisionNumber },
    });
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <PageHeader title="Policy/Quote" />

      <div className="flex-1 overflow-auto px-6 pb-8">
        <div className="flex flex-col gap-4">
          <form
            onSubmit={handlePolicySubmit}
            className="overflow-hidden rounded-xl border border-border"
          >
            <LoadFormHeader title="Load policy" />
            <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">
              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Policy business key
                </span>
                <input
                  autoFocus
                  required
                  value={policyBusinessKey}
                  onChange={(event) => setPolicyBusinessKey(event.target.value)}
                  placeholder="POL-001496"
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </label>
            </div>
            <LoadFormActions disabled={!canLoadPolicy} />
          </form>

          <form
            onSubmit={handleQuoteSubmit}
            className="overflow-hidden rounded-xl border border-border"
          >
            <LoadFormHeader title="Load quote" />
            <div className="flex flex-col gap-4 bg-muted/10 px-4 py-4">
              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Quote business key
                </span>
                <input
                  required
                  value={quoteBusinessKey}
                  onChange={(event) => setQuoteBusinessKey(event.target.value)}
                  placeholder="QUO-001500"
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </label>

              <label className="flex min-w-0 flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Revision number
                </span>
                <input
                  required
                  value={quoteRevisionNumber}
                  onChange={(event) =>
                    setQuoteRevisionNumber(event.target.value)
                  }
                  placeholder="1"
                  className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </label>
            </div>
            <LoadFormActions disabled={!canLoadQuote} />
          </form>
        </div>
      </div>
    </div>
  );
}

function LoadFormHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-3">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
  );
}

function LoadFormActions({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex items-center justify-end border-t border-border bg-background/40 px-4 py-3">
      <Button type="submit" disabled={disabled}>
        <Search className="h-4 w-4" />
        Load
      </Button>
    </div>
  );
}
