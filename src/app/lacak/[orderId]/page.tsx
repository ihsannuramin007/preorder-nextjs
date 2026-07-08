import { notFound } from "next/navigation";
import { getPublicOrder } from "@/actions/orders";
import { TrackingClient } from "./tracking-client";

export default async function LacakPesananPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getPublicOrder(orderId);
  if (!order) notFound();

  return <TrackingClient order={order} />;
}
