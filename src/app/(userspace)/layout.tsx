import Announcement from "@/features/shell/components/Announcement";
import TerminalHeader from "@/features/shell/components/TerminalHeader";
import WsReconnectModal from "@/features/shell/components/WsReconnectModal";
import { Events } from "@/features/trading/components/landing/Events";

export default async function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh text-white">
      <Announcement />
      <WsReconnectModal />
      <Events />
      <div className="flex-1 text-white size-full select-none touch-manipulation flex flex-col">
        <TerminalHeader />
        <main className="flex-1 px-2 pb-2 size-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
