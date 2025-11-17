import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, Grid3x3, Clock } from "lucide-react";
import type { InventoryItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardsProps {
  items: InventoryItem[];
  isLoading?: boolean;
}

export function SummaryCards({ items, isLoading }: SummaryCardsProps) {
  const totalItems = items.length;
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.lowStockThreshold
  ).length;
  const categories = new Set(items.map((item) => item.category)).size;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Prodotti totali",
      value: totalItems,
      description: `${totalQuantity} unità totali`,
      icon: Package,
      testId: "card-total-items",
    },
    {
      title: "Prodotti con Stock basso",
      value: lowStockItems,
      description: lowStockItems === 0 ? "Inventario assortito" : "Alcuni prodotti devono essere riassortiti",
      icon: AlertTriangle,
      badge: lowStockItems > 0,
      testId: "card-low-stock",
    },
    {
      title: "Categorie",
      value: categories,
      description: "Categorie attive",
      icon: Grid3x3,
      testId: "card-categories",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} data-testid={card.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-semibold tracking-tight" data-testid={`${card.testId}-value`}>
                  {card.value}
                </div>
                {card.badge && (
                  <Badge variant="destructive" className="text-xs">
                    Alert
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
