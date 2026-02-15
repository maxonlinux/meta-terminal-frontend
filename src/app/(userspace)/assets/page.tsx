import { Suspense } from "react";
import { PortfolioView } from "@/features/assets/components/PortfolioView";

async function PortfolioPage() {
  return (
    <Suspense fallback={null}>
      <PortfolioView />
    </Suspense>
  );
}

export default PortfolioPage;
