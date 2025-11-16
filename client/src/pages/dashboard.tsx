import { useQuery, useMutation } from "@tanstack/react-query";
import { SummaryCards } from "@/components/summary-cards";
import { LowStockAlert } from "@/components/low-stock-alert";
import { InventoryTable } from "@/components/inventory-table";
import { AddItemDialog } from "@/components/add-item-dialog";
import { QuickAdjustDialog } from "@/components/quick-adjust-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { InventoryItem, InsertInventoryItem, AdjustStock } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: InsertInventoryItem) => {
      return await apiRequest("POST", "/api/inventory", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Prodotto aggiunto",
        description: "Il prodotto è stato aggiunto con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Il prodotto non è stato aggiunto. Perfavore riprova di nuovo.",
        variant: "destructive",
      });
    },
  });

  const editItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertInventoryItem }) => {
      return await apiRequest("PUT", `/api/inventory/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Prodotto aggiornato",
        description: "Il prodotto è stato aggiornato con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Non è stato possibile aggiornare il prodotto. Perfavore riprovare.",
        variant: "destructive",
      });
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: async (data: AdjustStock) => {
      return await apiRequest("PATCH", `/api/inventory/${data.id}/adjust`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Stock aggiustato",
        description: "Il livello di stock è stato aggiornato con successo.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Operazione di aggiornamento stock fallita. Perfavore riprovare.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/inventory/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Prodotto eliminato",
        description: "Il prodotto è stato rimosso dall'inventario.",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Operazione di eliminazione di prodotto fallita. Perfavore riprovare.",
        variant: "destructive",
      });
    },
  });

  const handleExport = () => {
    const csvContent = [
      ["Item Name", "Category", "Quantity", "Unit", "Low Stock Threshold", "Status"],
      ...items.map((item) => [
        item.name,
        item.category,
        item.quantity.toString(),
        item.unit,
        item.lowStockThreshold.toString(),
        item.quantity <= item.lowStockThreshold ? "Low Stock" : "In Stock",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exportazione completata",
      description: "Il tuo inventario è stato esportato in CSV.",
    });
  };

  const isPending =
    addItemMutation.isPending     ||
    editItemMutation.isPending    ||
    adjustStockMutation.isPending ||
    deleteItemMutation.isPending;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitora and gestisci l'inventario del bar
          </p>
        </div>
      </div>

      <LowStockAlert items={items} />

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Azioni Rapide</h2>
        <div className="flex flex-wrap gap-4">
          <AddItemDialog
            onSubmit={async (data) => {
              await addItemMutation.mutateAsync(data);
            }}
            isPending={isPending}
          />
          <QuickAdjustDialog
            items={items}
            onSubmit={async (data) => {
              await adjustStockMutation.mutateAsync(data);
            }}
            isPending={isPending}
          />
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={items.length === 0}
            data-testid="button-export"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Esporta Prodotti
          </Button>
        </div>
      </div>

      <SummaryCards items={items} isLoading={isLoading} />

      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Inventory</h2>
          <p className="text-sm text-muted-foreground mt-1">
            All items in your bar inventory
          </p>
        </div> 
        <InventoryTable
          items={items}
          isLoading={isLoading}
          onAdjustStock={async (data) => {
            await adjustStockMutation.mutateAsync(data);
          }}
          onEditItem={async (id, data) => {
            await editItemMutation.mutateAsync({ id, data });
          }}
          onDeleteItem={async (id) => {
            await deleteItemMutation.mutateAsync(id);
          }}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
