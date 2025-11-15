import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustStockSchema, type AdjustStock, type InventoryItem } from "@shared/schema";
import { Minus, Plus, TrendingUp } from "lucide-react";

interface StockAdjustDialogProps {
  item: InventoryItem;
  onSubmit: (data: AdjustStock) => Promise<void>;
  isPending?: boolean;
}

export function StockAdjustDialog({ item, onSubmit, isPending }: StockAdjustDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<AdjustStock>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      id: item.id,
      adjustment: 0,
    },
  });

  const handleSubmit = async (data: AdjustStock) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
  };

  const adjustment = form.watch("adjustment");
  const newQuantity = item.quantity + (Number(adjustment) || 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid={`button-adjust-${item.id}`}>
          <TrendingUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Quick Stock Adjustment
          </DialogTitle>
          <DialogDescription>
            Adjust stock for <span className="font-medium text-foreground">{item.name}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Current Stock</span>
                <span className="text-2xl font-semibold">
                  {item.quantity} <span className="text-sm text-muted-foreground">{item.unit}</span>
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="adjustment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("adjustment", (Number(field.value) || 0) - 1)}
                      data-testid="button-decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="text-center"
                        {...field}
                        data-testid="input-adjustment"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => form.setValue("adjustment", (Number(field.value) || 0) + 1)}
                      data-testid="button-increase"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">New Stock Level</span>
                <span className={`text-2xl font-semibold ${newQuantity <= item.lowStockThreshold ? 'text-destructive' : ''}`}>
                  {newQuantity} <span className="text-sm text-muted-foreground">{item.unit}</span>
                </span>
              </div>
              {newQuantity <= item.lowStockThreshold && (
                <p className="text-xs text-destructive mt-2">
                  Below low stock threshold ({item.lowStockThreshold})
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                data-testid="button-adjust-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-adjust-submit">
                {isPending ? "Updating..." : "Update Stock"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
