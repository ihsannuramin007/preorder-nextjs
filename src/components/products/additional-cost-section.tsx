"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyDisplay } from "@/components/shared/currency-display";
import { CurrencyInput } from "@/components/shared/currency-input";
import {
  addAdditionalCost,
  removeAdditionalCost,
  getAdditionalCosts,
} from "@/actions/additional-costs";
import { Plus, Trash2 } from "lucide-react";

type AdditionalCostItem = Awaited<ReturnType<typeof getAdditionalCosts>>[number];

const QUICK_LABELS = ["Kemasan", "Stiker", "Paper Bag", "Gas", "Listrik"];

export function AdditionalCostSection({
  productId,
  initialCosts,
  onChange,
}: {
  productId: string;
  initialCosts: AdditionalCostItem[];
  onChange?: (costs: AdditionalCostItem[]) => void;
}) {
  const [costs, setCosts] = useState<AdditionalCostItem[]>(initialCosts);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  function notify(next: AdditionalCostItem[]) {
    setCosts(next);
    onChange?.(next);
  }

  function handleAdd() {
    const value = parseFloat(amount);
    if (!label.trim() || !value || value <= 0) {
      toast.error("Isi nama dan jumlah biaya");
      return;
    }
    startTransition(async () => {
      const result = await addAdditionalCost(productId, label, value);
      if (result.success) {
        const refreshed = await getAdditionalCosts(productId);
        notify(refreshed);
        setLabel("");
        setAmount("");
        toast.success("Biaya tambahan ditambahkan!");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      const result = await removeAdditionalCost(id);
      if (result.success) {
        notify(costs.filter((c) => c.id !== id));
        toast.success("Biaya tambahan dihapus");
      } else {
        toast.error(result.error);
      }
    });
  }

  const total = costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Biaya Tambahan</p>
        <CurrencyDisplay amount={total} size="sm" className="font-semibold text-primary-700" />
      </div>

      {costs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          Belum ada biaya tambahan (kemasan, gas, listrik, dll).
        </p>
      ) : (
        <div className="space-y-2">
          {costs.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <p className="text-sm font-medium">{c.label}</p>
              <div className="flex items-center gap-2">
                <CurrencyDisplay amount={c.amount} size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemove(c.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3.5 w-3.5 text-error" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 flex-wrap">
        {QUICK_LABELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLabel(l)}
            className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:border-primary-300"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Nama biaya (mis: Kemasan)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="flex-1"
        />
        <CurrencyInput
          placeholder="Jumlah"
          value={amount}
          onChange={(value) => setAmount(String(value))}
          className="w-20"
        />
        <Button onClick={handleAdd} disabled={isPending}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
