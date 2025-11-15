import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InventoryItem } from "@shared/schema";

interface LowStockAlertProps {
  items: InventoryItem[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  const [dismissed, setDismissed] = useState(false);
  
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.lowStockThreshold
  );

  if (lowStockItems.length === 0 || dismissed) {
    return null;
  }

  return (
    <Alert className="border-destructive/50 bg-destructive/10" data-testid="alert-low-stock">
      <AlertTriangle className="h-5 w-5 text-destructive" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <span className="font-medium text-destructive">Low Stock Warning:</span>{" "}
          <span className="text-foreground">
            {lowStockItems.length} item{lowStockItems.length !== 1 ? "s" : ""} need
            restocking
          </span>
          <span className="text-muted-foreground ml-2">
            ({lowStockItems.map((item) => item.name).join(", ")})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setDismissed(true)}
          data-testid="button-dismiss-alert"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
