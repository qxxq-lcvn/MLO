"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useDesignerStore } from "@/store/useDesignerStore";
import { getDef } from "@/lib/definitions";
import { FAUNA_BY_ID } from "@/data/faunaDefinitions";

const SCALE = 1 / 80;

export default function Map3DPreview({ onClose }: { onClose: () => void }) {
  const items = useDesignerStore((s) => s.items);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="flex h-[80vh] w-[90vw] max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex h-12 items-center justify-between border-b border-slate-200 px-4">
          <span className="text-sm font-semibold text-slate-700">Map Preview — Side view (drag to rotate)</span>
          <button onClick={onClose} className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100">
            Close ✕
          </button>
        </div>
        <div className="flex-1 bg-gradient-to-b from-sky-200 to-sky-50">
          <Canvas camera={{ position: [8, 6, 12], fov: 50 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 4]} intensity={0.5} />
            <Suspense fallback={null}>
              <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[30, 20]} />
                <meshStandardMaterial color="#6f5439" />
              </mesh>
              {items.map((item) => {
                const def = getDef(item.defId);
                if (!def) return null;
                const x = (item.x - 1000) * SCALE;
                const z = (item.y - 650) * SCALE;
                let y = 0;
                if (item.kind === "fauna") {
                  const fauna = FAUNA_BY_ID[item.defId];
                  y = fauna ? (fauna.elevationRange[0] + fauna.elevationRange[1]) / 2 / 6 : 0;
                } else if (item.kind === "field" || item.kind === "water") {
                  y = -0.15;
                }
                return (
                  <group key={item.id} position={[x, y, z]}>
                    <Html center distanceFactor={14} style={{ pointerEvents: "none" }}>
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-sm shadow"
                        style={{ backgroundColor: `${def.color}33`, border: `1px solid ${def.color}` }}
                      >
                        {def.icon}
                      </div>
                    </Html>
                  </group>
                );
              })}
            </Suspense>
            <OrbitControls target={[0, 0.5, 0]} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
