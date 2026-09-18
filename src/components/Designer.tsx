"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MapCanvas from "@/components/map/MapCanvas";
import EcosystemDashboard from "@/components/dashboard/EcosystemDashboard";
import PlantPreviewPanel from "@/components/plant/PlantPreviewPanel";
import { useDesignerStore } from "@/store/useDesignerStore";

const Map3DPreview = dynamic(() => import("@/components/map/Map3DPreview"), { ssr: false });

export default function Designer() {
  const selectedPlacedId = useDesignerStore((s) => s.selectedPlacedId);
  const items = useDesignerStore((s) => s.items);
  const show3D = useDesignerStore((s) => s.show3D);
  const toggle3D = useDesignerStore((s) => s.toggle3D);

  const selectedPlant = items.find((it) => it.id === selectedPlacedId && it.kind === "plant");

  return (
    <div className="grid h-screen w-screen grid-cols-[220px_1fr] grid-rows-[56px_1fr_140px]">
      <div className="col-start-1 row-span-3">
        <Sidebar />
      </div>
      <div className="col-start-2 row-start-1">
        <TopBar />
      </div>
      <div className="relative col-start-2 row-start-2 flex overflow-hidden">
        <div className="flex-1">
          <MapCanvas />
        </div>
        {selectedPlant && (
          <div className="h-full w-[340px] shrink-0 border-l border-slate-200 shadow-lg">
            <PlantPreviewPanel />
          </div>
        )}
      </div>
      <div className="col-start-2 row-start-3">
        <EcosystemDashboard />
      </div>

      {show3D && <Map3DPreview onClose={toggle3D} />}
    </div>
  );
}
