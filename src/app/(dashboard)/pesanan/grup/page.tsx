import { redirect } from "next/navigation";

export default function GroupOrdersRedirect() {
  redirect("/pesanan?tab=grup");
}
