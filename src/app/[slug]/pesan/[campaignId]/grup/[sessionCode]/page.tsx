import { getPublicGroupOrder } from "@/actions/group-orders";
import { MemberOrderClient } from "./member-order-client";

export default async function MemberOrderPage({
  params,
}: {
  params: Promise<{ slug: string; campaignId: string; sessionCode: string }>;
}) {
  const { slug, campaignId, sessionCode } = await params;
  const groupOrder = await getPublicGroupOrder(sessionCode);

  if (!groupOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold">Sesi tidak ditemukan</p>
          <p className="text-sm text-muted-foreground mt-1">Link ini tidak valid atau sudah kadaluarsa.</p>
        </div>
      </div>
    );
  }

  const group = {
    id: groupOrder.id,
    sessionCode: groupOrder.sessionCode,
    facilitatorName: groupOrder.facilitatorName,
    status: groupOrder.status,
    memberCount: groupOrder.memberOrders?.length ?? 0,
    campaign: {
      id: groupOrder.campaign!.id,
      name: groupOrder.campaign!.name,
      products: (groupOrder.campaign!.products ?? []).map((cp) => ({
        product: {
          id: cp.product!.id,
          name: cp.product!.name,
          basePrice: Number(cp.product!.basePrice),
          imageUrl: cp.product!.imageUrl,
          variants: (cp.product!.variants ?? []).map((v) => ({
            id: v.id,
            name: v.name,
            priceAdjustment: Number(v.priceAdjustment),
          })),
        },
      })),
    },
  };

  return (
    <MemberOrderClient
      group={group}
      slug={slug}
      campaignId={campaignId}
      sessionCode={sessionCode}
    />
  );
}
