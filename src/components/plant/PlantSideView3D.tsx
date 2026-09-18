"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { PlacedItem } from "@/types/map";
import { FAUNA_BY_ID } from "@/data/faunaDefinitions";

function elevationToSceneY(range: [number, number]) {
  const mid = (range[0] + range[1]) / 2;
  return mid / 4; // scale down the plan's elevation units into a compact scene
}

function FaunaMarker({ faunaId, index }: { faunaId: string; index: number }) {
  const def = FAUNA_BY_ID[faunaId];
  if (!def) return null;
  const y = elevationToSceneY(def.elevationRange);
  const angle = (index / 6) * Math.PI * 2;
  const radius = 0.9;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return (
    <group position={[x, y, z]}>
      <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="flex flex-col items-center">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-base shadow"
            style={{ backgroundColor: `${def.color}33`, border: `1px solid ${def.color}` }}
          >
            {def.icon}
          </div>
          <span className="mt-0.5 rounded bg-black/60 px-1 text-[9px] text-white">{def.name}</span>
        </div>
      </Html>
    </group>
  );
}

function RicePlantModel({ damagePercent }: { damagePercent: number }) {
  const health = 1 - damagePercent / 100;
  const bladeColor = health > 0.6 ? "#659732" : health > 0.3 ? "#c2a24d" : "#8a6a4b";

  return (
    <group>
      {/* subsoil */}
      <mesh position={[0, -1.1, 0]}>
        <boxGeometry args={[3, 0.6, 3]} />
        <meshStandardMaterial color="#573f2a" />
      </mesh>
      {/* mud / ground */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color="#6f5439" />
      </mesh>
      {/* water layer */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[3, 0.25, 3]} />
        <meshStandardMaterial color="#3a8fc0" transparent opacity={0.55} />
      </mesh>

      {/* plant blades */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.sin(i) * 0.12, 0.55, Math.cos(i) * 0.12]} rotation={[0, 0, Math.sin(i) * 0.15]}>
          <cylinderGeometry args={[0.02, 0.03, 1.3, 6]} />
          <meshStandardMaterial color={bladeColor} />
        </mesh>
      ))}
      {/* panicle */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color={health > 0.5 ? "#e9d38b" : "#a89055"} />
      </mesh>
    </group>
  );
}

export default function PlantSideView3D({
  plant,
  allItems,
}: {
  plant: PlacedItem;
  allItems: PlacedItem[];
}) {
  const attachedDefIds = useMemo(() => {
    const ids = plant.plantData?.attachedFauna ?? [];
    return ids
      .map((placedId) => allItems.find((it) => it.id === placedId)?.defId)
      .filter((v): v is string => Boolean(v));
  }, [plant.plantData, allItems]);

  return (
    <div className="h-64 w-full overflow-hidden rounded-md bg-gradient-to-b from-sky-200 to-sky-50">
      <Canvas camera={{ position: [3.2, 1.8, 3.2], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={0.6} />
        <Suspense fallback={null}>
          <RicePlantModel damagePercent={plant.plantData?.damagePercent ?? 0} />
          {attachedDefIds.map((faunaDefId, idx) => (
            <FaunaMarker key={`${faunaDefId}-${idx}`} faunaId={faunaDefId} index={idx} />
          ))}
        </Suspense>
        <OrbitControls enablePan={false} minDistance={2} maxDistance={7} target={[0, 0.3, 0]} />
      </Canvas>
    </div>
  );
}
