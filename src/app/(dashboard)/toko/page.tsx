import { getStoreSetupData } from "@/actions/store";
import { TokoClient } from "./toko-client";

export default async function TokoPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { welcome } = await searchParams;
  const { store, businessName } = await getStoreSetupData();

  return <TokoClient initialStore={store} businessName={businessName} isWelcome={welcome === "1"} />;
}
