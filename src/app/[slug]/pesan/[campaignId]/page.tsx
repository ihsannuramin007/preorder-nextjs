import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderForm } from "./order-form";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string; campaignId: string }> };

async function getCampaign(slug: string, campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      store: { select: { name: true, slug: true } },
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
              imageUrl: true,
              variants: {
                where: { isActive: true },
                select: { id: true, name: true, priceAdjustment: true },
              },
            },
          },
        },
      },
    },
  });

  if (!campaign || campaign.store.slug !== slug) return null;

  return {
    id: campaign.id,
    name: campaign.name,
    store: campaign.store,
    products: campaign.products.map((cp) => ({
      product: {
        ...cp.product,
        basePrice: Number(cp.product.basePrice),
        variants: cp.product.variants.map((v) => ({
          ...v,
          priceAdjustment: Number(v.priceAdjustment),
        })),
      },
    })),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, campaignId } = await params;
  const campaign = await getCampaign(slug, campaignId);
  if (!campaign) return {};
  return {
    title: `${campaign.name} — ${campaign.store.name}`,
  };
}

export default async function OrderFormPage({ params }: Props) {
  const { slug, campaignId } = await params;
  const campaign = await getCampaign(slug, campaignId);

  if (!campaign) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">{campaign.store.name}</p>
          <h1 className="text-xl font-bold">{campaign.name}</h1>
        </div>
        <OrderForm campaign={campaign} slug={slug} campaignId={campaignId} />
      </div>
    </div>
  );
}
