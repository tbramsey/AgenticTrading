import React, { useState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LaunchButton: React.FC = () => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    setStatus("Initializing launch sequence...");

    try {
      const res = await fetch("http://127.0.0.1:5000/portfolio/launch");
      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Portfolio launched successfully");
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  const statusTone = cn(
    "text-sm font-medium transition-opacity",
    status.includes("Error") || status.includes("Failed")
      ? "text-destructive"
      : status.includes("✅")
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-muted-foreground",
    status ? "opacity-100" : "opacity-0"
  );

  return (
    <Card className="h-full w-full border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-2 border-b border-border/70 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Rocket className="size-5 text-primary" />
          Deploy portfolio
        </CardTitle>
        <CardDescription>
          Send the current allocation to your backend for execution.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 py-6">
        <Button
          onClick={handleApply}
          disabled={isLoading}
          className="w-full gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Launching…
            </>
          ) : (
            <>
              <Rocket className="size-4" />
              Launch portfolio
            </>
          )}
        </Button>

        <p className={statusTone} aria-live="polite">
          {status || "Waiting to launch"}
        </p>
      </CardContent>
    </Card>
  );
};

export default LaunchButton;
