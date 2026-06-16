import { headers } from "next/headers";
import { getPublicGroupOrder } from "@/actions/group-orders";
import { RingkasanClient } from "./ringkasan-client";

export default async function RingkasanPage({
  params,
}: {
  params: Promise<{ slug: string; campaignId: string; sessionCode: string }>;
}) {
  const { slug, campaignId, sessionCode } = await params;
  const groupOrder = await getPublicGroupOrder(sessionCode);

  if (!groupOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-muted-foreground">Sesi tidak ditemukan.</p>
      </div>
    );
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const memberLink = `${protocol}://${host}/${slug}/pesan/${campaignId}/grup/${sessionCode}`;

  const group = {
    id: groupOrder.id,
    sessionCode: groupOrder.sessionCode,
    facilitatorName: groupOrder.facilitatorName,
    facilitatorPhone: groupOrder.facilitatorPhone,
    facilitatorAddress: groupOrder.facilitatorAddress,
    facilitatorNotes: groupOrder.facilitatorNotes,
    status: groupOrder.status,
    totalAmount: Number(groupOrder.totalAmount),
    campaign: { id: groupOrder.campaign!.id, name: groupOrder.campaign!.name },
  };

  const members = (groupOrder.memberOrders ?? []).map((m) => ({
    id: m.id,
    memberName: m.memberName,
    subtotal: Number(m.subtotal),
    items: (m.items ?? []).map((i) => ({
      id: i.id,
      productName: i.productName,
      variantName: i.variantName,
      unitPrice: Number(i.unitPrice),
      quantity: i.quantity,
      subtotal: Number(i.subtotal),
    })),
  }));

  return (
    <RingkasanClient group={group} members={members} memberLink={memberLink} sessionCode={sessionCode} />
  );
}
