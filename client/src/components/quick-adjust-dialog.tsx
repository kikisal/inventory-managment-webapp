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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustStockSchema, type AdjustStock, type InventoryItem } from "@shared/schema";
import { Minus, Plus, TrendingUp } from "lucide-react";

interface QuickAdjustDialogProps {
  items: InventoryItem[];
  onSubmit: (data: AdjustStock) => Promise<void>;
  isPending?: boolean;
}

export function QuickAdjustDialog({ items, onSubmit, isPending }: QuickAdjustDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>(-1);

  const form = useForm<AdjustStock>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      id: "",
      adjustment: 0,
    },
  });

  const handleSubmit = async (data: AdjustStock) => {
    await onSubmit(data);
    setOpen(false);
    form.reset();
    setSelectedItemId(-1);
  };

  const selectedItem = items.find((item) => item.id === selectedItemId);
  const adjustment = form.watch("adjustment");
  const newQuantity = selectedItem ? selectedItem.quantity + (Number(adjustment) || 0) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" data-testid="button-quick-adjust" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Correzione Quantità
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Correzione Rapida di Stock
          </DialogTitle>
          <DialogDescription>
            Seleziona un prodotto e correggi il suo livello di stock
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Seleziona Prodotto</label>
                <Select
                  value={'' + selectedItemId}
                  onValueChange={(value) => {
                    setSelectedItemId(parseInt(value));
                    form.setValue("id", value);
                  }}
                >
                  <SelectTrigger data-testid="select-quick-adjust-item">
                    <SelectValue placeholder="Choose an item to adjust" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={'' + item.id}>
                        {item.name} ({item.quantity} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedItem && (
                <>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Stock Attuale</span>
                      <span className="text-2xl font-semibold">
                        {selectedItem.quantity}{" "}
                        <span className="text-sm text-muted-foreground">{selectedItem.unit}</span>
                      </span>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="adjustment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correzione</FormLabel>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => form.setValue("adjustment", (Number(field.value) || 0) - 1)}
                            data-testid="button-quick-decrease"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="text-center"
                              {...field}
                              data-testid="input-quick-adjustment"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => form.setValue("adjustment", (Number(field.value) || 0) + 1)}
                            data-testid="button-quick-increase"
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
                      <span className="text-sm text-muted-foreground">Nuovo Livello di Stock</span>
                      <span
                        className={`text-2xl font-semibold ${
                          newQuantity <= selectedItem.lowStockThreshold ? "text-destructive" : ""
                        }`}
                      >
                        {newQuantity}{" "}
                        <span className="text-sm text-muted-foreground">{selectedItem.unit}</span>
                      </span>
                    </div>
                    {newQuantity <= selectedItem.lowStockThreshold && (
                      <p className="text-xs text-destructive mt-2">
                        Sotto al livello minimo di stock ({selectedItem.lowStockThreshold})
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setSelectedItemId(-1);
                  form.reset();
                }}
                disabled={isPending}
                data-testid="button-quick-adjust-cancel"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isPending || !selectedItemId}
                data-testid="button-quick-adjust-submit"
              >
                {isPending ? "Aggiornando..." : "Aggiorna Stock"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
