import React, { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface SettingsButtonProps {
  onApply: (diversification: number, risk: number, sectors: string[]) => void;
  defaultDiver?: number;
  defaultRisk?: number;
}

const defaultSectors = [
  "INDUSTRIALS",
  "HEALTHCARE",
  "TECHNOLOGY",
  "UTILITIES",
  "FINANCIAL SERVICES",
  "BASIC MATERIALS",
  "CONSUMER CYCLICAL",
  "REAL ESTATE",
  "COMMUNICATION SERVICES",
  "CONSUMER DEFENSIVE",
  "ENERGY",
];

const SettingsButton: React.FC<SettingsButtonProps> = ({
  onApply,
  defaultDiver = 50,
  defaultRisk = 50,
}) => {
  const [tempRisk, setTempRisk] = useState<number>(defaultRisk);
  const [tempDiver, setTempDiver] = useState<number>(defaultDiver);
  const [tempSectors, setTempSectors] = useState<string[]>([...defaultSectors]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSectorChange = (sector: string) => {
    setTempSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const handleApply = () => {
    onApply(tempDiver, tempRisk, tempSectors);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full border-dashed border-border/70 shadow-xs transition-all",
            isOpen && "rotate-90 bg-accent text-accent-foreground"
          )}
        >
          <Settings2 className="size-5" />
          <span className="sr-only">Open portfolio settings</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-md border-l border-border/60 bg-background"
      >
        <SheetHeader>
          <SheetTitle>Portfolio settings</SheetTitle>
          <SheetDescription>
            Tune diversification, risk tolerance, and sector preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-2 py-2">
          <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>Diversification</span>
              <span className="text-primary">{tempDiver}%</span>
            </div>
            <Slider
              value={[tempDiver]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => setTempDiver(value)}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>Risk tolerance</span>
              <span className="text-destructive">{tempRisk}%</span>
            </div>
            <Slider
              value={[tempRisk]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => setTempRisk(value)}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>Active sectors</span>
              <span className="text-xs text-muted-foreground">{tempSectors.length} selected</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {defaultSectors.map((sector) => {
                const isSelected = tempSectors.includes(sector);
                return (
                  <Toggle
                    key={sector}
                    pressed={isSelected}
                    onPressedChange={() => handleSectorChange(sector)}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "justify-start rounded-full text-[11px] font-semibold uppercase",
                      isSelected && "border-primary/60 bg-primary/10 text-primary"
                    )}
                  >
                    {sector.replace("_", " ")}
                  </Toggle>
                );
              })}
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="flex w-full gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button className="w-full" onClick={handleApply}>
              Apply changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsButton;
