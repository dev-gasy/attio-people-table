import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CopyToClipboardProps = {
  className?: string;
  label?: string;
  value: string;
};

export function CopyToClipboard({
  className,
  label = "Copy to clipboard",
  value,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function handleCopy() {
    if (!navigator.clipboard || !value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1_500);
    } catch {
      setCopied(false);
    }
  }

  const accessibleLabel = copied ? "Copied" : label;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      className={cn(
        "shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
        className,
      )}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      disabled={!value}
      onClick={handleCopy}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
    </Button>
  );
}
