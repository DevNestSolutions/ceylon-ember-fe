// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Float, Environment, ContactShadows, Sparkles, useTexture } from "@react-three/drei";
// import { useRef, Suspense, type MutableRefObject } from "react";
// import * as THREE from "three";
// import burger from "../../assets/hero-burger.png";
// import steak from "../../assets/hero-steak.png";
// import plate from "../../assets/hero-plate.png";

// export type DishId = "burger" | "steak" | "plate";

// const SOURCES: Record<DishId, string> = { burger, steak, plate };
// const ORDER: DishId[] = ["burger", "steak", "plate"];

// // Cinematic camera waypoints — one per section.
// // Index 0 = hero, last = footer. Lerped by global scroll progress.
// const WAYPOINTS: { pos: [number, number, number]; look: [number, number, number]; fov: number }[] = [
//   { pos: [0,    0.2,  6.0], look: [0,    0,   0], fov: 38 }, // hero
//   { pos: [2.6,  0.6,  6.6], look: [0.5,  0,   0], fov: 34 }, // dishes
//   { pos: [-2.9, -0.3, 7.2], look: [-0.5, 0,   0], fov: 40 }, // chefs
//   { pos: [0,    1.4,  8.0], look: [0,    0.3, 0], fov: 30 }, // about
//   { pos: [3.2,  -0.7, 6.4], look: [0.6,  -0.3,0], fov: 36 }, // reviews
//   { pos: [-2.0, 0.3,  5.4], look: [0,    0.1, 0], fov: 44 }, // reserve
//   { pos: [0,    -0.5, 5.0], look: [0,    -0.2,0], fov: 38 }, // footer
// ];

// function DishStack({ active, progressRef }: { active: DishId; progressRef: MutableRefObject<number> }) {
//   const textures = useTexture([SOURCES.burger, SOURCES.steak, SOURCES.plate]);
//   textures.forEach((t) => { t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; });
//   const group = useRef<THREE.Group>(null);
//   const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);
//   const targetRot = useRef(new THREE.Vector2(0, 0));

//   useFrame((state, dt) => {
//     // Crossfade dish textures
//     ORDER.forEach((id, i) => {
//       const target = id === active ? 1 : 0;
//       const mat = matsRef.current[i];
//       if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, Math.min(1, dt * 5));
//     });
//     if (!group.current) return;

//     // Pointer-driven sway (mouse-follow)
//     targetRot.current.x = state.pointer.y * 0.18;
//     targetRot.current.y = state.pointer.x * 0.32;

//     // Scroll-driven slow rotation + drift
//     const p = progressRef.current;
//     const driftY = p * Math.PI * 1.6;            // ~0.8 turns across page
//     const driftX = Math.sin(p * Math.PI * 2) * 0.15;
//     const liftY  = Math.sin(p * Math.PI) * 0.5;  // arc upward then back

//     const k = Math.min(1, dt * 3.2);
//     group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRot.current.x + driftX, k);
//     group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRot.current.y + driftY, k);
//     group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, liftY, k);
//   });

//   return (
//     <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.8}>
//       <group ref={group}>
//         {ORDER.map((id, i) => (
//           <mesh key={id} position={[0, 0, i * 0.001]}>
//             <planeGeometry args={[4.2, 4.2]} />
//             <meshStandardMaterial
//               ref={(m) => { if (m) matsRef.current[i] = m; }}
//               map={textures[i]}
//               transparent
//               opacity={id === active ? 1 : 0}
//               alphaTest={0.02}
//               depthWrite={false}
//               roughness={0.35}
//               metalness={0.15}
//               emissive={new THREE.Color("#ffb060")}
//               emissiveIntensity={0.12}
//               side={THREE.DoubleSide}
//             />
//           </mesh>
//         ))}
//       </group>
//     </Float>
//   );
// }

// function Ring({ progressRef }: { progressRef: MutableRefObject<number> }) {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame((s, dt) => {
//     if (!ref.current) return;
//     ref.current.rotation.z = s.clock.elapsedTime * 0.15;
//     const p = progressRef.current;
//     const k = Math.min(1, dt * 2.5);
//     ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -0.2 + p * 0.4, k);
//     const tilt = Math.PI / 2.2 + Math.sin(p * Math.PI * 2) * 0.25;
//     ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, tilt, k);
//   });
//   return (
//     <mesh ref={ref} position={[0, -0.2, -1]} rotation={[Math.PI / 2.2, 0, 0]}>
//       <torusGeometry args={[2.6, 0.015, 16, 200]} />
//       <meshStandardMaterial color="#f4c06b" emissive="#ff8a3d" emissiveIntensity={1.2} toneMapped={false} />
//     </mesh>
//   );
// }

// function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
//   const { camera } = useThree();
//   const lookAt = useRef(new THREE.Vector3(0, 0, 0));
//   const tmpPos = useRef(new THREE.Vector3());
//   const tmpLook = useRef(new THREE.Vector3());

//   useFrame((state, dt) => {
//     const segs = WAYPOINTS.length - 1;
//     const p = THREE.MathUtils.clamp(progressRef.current, 0, 1) * segs;
//     const i = Math.min(segs - 1, Math.floor(p));
//     const tRaw = p - i;
//     // Smoothstep for cinematic ease between sections
//     const t = tRaw * tRaw * (3 - 2 * tRaw);
//     const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];

//     tmpPos.current.set(
//       a.pos[0] + (b.pos[0] - a.pos[0]) * t + state.pointer.x * 0.25,
//       a.pos[1] + (b.pos[1] - a.pos[1]) * t + state.pointer.y * 0.18,
//       a.pos[2] + (b.pos[2] - a.pos[2]) * t,
//     );
//     tmpLook.current.set(
//       a.look[0] + (b.look[0] - a.look[0]) * t,
//       a.look[1] + (b.look[1] - a.look[1]) * t,
//       0,
//     );

//     const k = Math.min(1, dt * 2.6);
//     camera.position.lerp(tmpPos.current, k);
//     lookAt.current.lerp(tmpLook.current, k);
//     camera.lookAt(lookAt.current);

//     const fov = a.fov + (b.fov - a.fov) * t;
//     const cam = camera as THREE.PerspectiveCamera;
//     cam.fov += (fov - cam.fov) * k;
//     cam.updateProjectionMatrix();
//   });

//   return null;
// }

// export function Hero3D({ active, progressRef }: { active: DishId; progressRef: MutableRefObject<number> }) {
//   return (
//     <Canvas
//       camera={{ position: [0, 0.2, 6], fov: 38 }}
//       gl={{ antialias: true, alpha: true }}
//       dpr={[1, 2]}
//     >
//       <Suspense fallback={null}>
//         <ambientLight intensity={0.35} />
//         <spotLight position={[5, 6, 5]} angle={0.4} penumbra={1} intensity={2.5} color="#ffb060" castShadow />
//         <pointLight position={[-4, -2, -3]} intensity={1.2} color="#ff6a2e" />
//         <pointLight position={[3, -3, 2]} intensity={0.6} color="#ffd089" />
//         <Ring progressRef={progressRef} />
//         <DishStack active={active} progressRef={progressRef} />
//         <Sparkles count={80} scale={[10, 7, 5]} size={2.4} speed={0.35} color="#ffc46a" />
//         <ContactShadows position={[0, -2.2, 0]} opacity={0.5} scale={8} blur={2.6} far={4} />
//         <Environment preset="night" />
//         <CameraRig progressRef={progressRef} />
//       </Suspense>
//     </Canvas>
//   );
// }




import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, ContactShadows, Sparkles, useTexture } from "@react-three/drei";
import { useRef, Suspense, type MutableRefObject } from "react";
import * as THREE from "three";
import burger from "@/assets/hero-burger.png";
import steak from "@/assets/hero-steak.png";
import plate from "@/assets/hero-plate.png";

export type DishId = "burger" | "steak" | "plate";

const SOURCES: Record<DishId, string> = { burger, steak, plate };
const ORDER: DishId[] = ["burger", "steak", "plate"];

const WAYPOINTS = [
  { pos: [0, 0.2, 6.0] as [number, number, number], look: [0, 0, 0] as [number, number, number], fov: 38 },
  { pos: [2.6, 0.6, 6.6] as [number, number, number], look: [0.5, 0, 0] as [number, number, number], fov: 34 },
  { pos: [-2.9, -0.3, 7.2] as [number, number, number], look: [-0.5, 0, 0] as [number, number, number], fov: 40 },
  { pos: [0, 1.4, 8.0] as [number, number, number], look: [0, 0.3, 0] as [number, number, number], fov: 30 },
  { pos: [3.2, -0.7, 6.4] as [number, number, number], look: [0.6, -0.3, 0] as [number, number, number], fov: 36 },
  { pos: [-2.0, 0.3, 5.4] as [number, number, number], look: [0, 0.1, 0] as [number, number, number], fov: 44 },
  { pos: [0, -0.5, 5.0] as [number, number, number], look: [0, -0.2, 0] as [number, number, number], fov: 38 },
];

function DishStack({ active, progressRef }: { active: DishId; progressRef: MutableRefObject<number> }) {
  const textures = useTexture([SOURCES.burger, SOURCES.steak, SOURCES.plate]);
  textures.forEach((t) => { t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; });
  const group = useRef<THREE.Group>(null);
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const targetRot = useRef(new THREE.Vector2(0, 0));

  useFrame((state, dt) => {
    ORDER.forEach((id, i) => {
      const target = id === active ? 1 : 0;
      const mat = matsRef.current[i];
      if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, Math.min(1, dt * 5));
    });
    if (!group.current) return;
    targetRot.current.x = state.pointer.y * 0.18;
    targetRot.current.y = state.pointer.x * 0.32;
    const p = progressRef.current;
    const driftY = p * Math.PI * 1.6;
    const driftX = Math.sin(p * Math.PI * 2) * 0.15;
    const liftY = Math.sin(p * Math.PI) * 0.5;
    const k = Math.min(1, dt * 3.2);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRot.current.x + driftX, k);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRot.current.y + driftY, k);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, liftY, k);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.8}>
      <group ref={group}>
        {ORDER.map((id, i) => (
          <mesh key={id} position={[0, 0, i * 0.001]}>
            <planeGeometry args={[4.2, 4.2]} />
            <meshStandardMaterial
              ref={(m) => { if (m) matsRef.current[i] = m; }}
              map={textures[i]}
              transparent
              opacity={id === active ? 1 : 0}
              alphaTest={0.02}
              depthWrite={false}
              roughness={0.35}
              metalness={0.15}
              emissive={new THREE.Color("#ffb060")}
              emissiveIntensity={0.12}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Ring({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.15;
    const p = progressRef.current;
    const k = Math.min(1, dt * 2.5);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, -0.2 + p * 0.4, k);
    const tilt = Math.PI / 2.2 + Math.sin(p * Math.PI * 2) * 0.25;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, tilt, k);
  });
  return (
    <mesh ref={ref} position={[0, -0.2, -1]} rotation={[Math.PI / 2.2, 0, 0]}>
      <torusGeometry args={[2.6, 0.015, 16, 200]} />
      <meshStandardMaterial color="#f4c06b" emissive="#ff8a3d" emissiveIntensity={1.2} toneMapped={false} />
    </mesh>
  );
}

function CameraRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const segs = WAYPOINTS.length - 1;
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1) * segs;
    const i = Math.min(segs - 1, Math.floor(p));
    const tRaw = p - i;
    const t = tRaw * tRaw * (3 - 2 * tRaw);
    const a = WAYPOINTS[i], b = WAYPOINTS[i + 1];
    tmpPos.current.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * t + state.pointer.x * 0.25,
      a.pos[1] + (b.pos[1] - a.pos[1]) * t + state.pointer.y * 0.18,
      a.pos[2] + (b.pos[2] - a.pos[2]) * t,
    );
    tmpLook.current.set(
      a.look[0] + (b.look[0] - a.look[0]) * t,
      a.look[1] + (b.look[1] - a.look[1]) * t,
      0,
    );
    const k = Math.min(1, dt * 2.6);
    camera.position.lerp(tmpPos.current, k);
    lookAt.current.lerp(tmpLook.current, k);
    camera.lookAt(lookAt.current);
    const fov = a.fov + (b.fov - a.fov) * t;
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov += (fov - cam.fov) * k;
    cam.updateProjectionMatrix();
  });
  return null;
}

export function Hero3D({ active, progressRef }: { active: DishId; progressRef: MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <spotLight position={[5, 6, 5]} angle={0.4} penumbra={1} intensity={2.5} color="#ffb060" castShadow />
        <pointLight position={[-4, -2, -3]} intensity={1.2} color="#ff6a2e" />
        <pointLight position={[3, -3, 2]} intensity={0.6} color="#ffd089" />
        <Ring progressRef={progressRef} />
        <DishStack active={active} progressRef={progressRef} />
        <Sparkles count={80} scale={[10, 7, 5]} size={2.4} speed={0.35} color="#ffc46a" />
        <ContactShadows position={[0, -2.2, 0]} opacity={0.5} scale={8} blur={2.6} far={4} />
        <Environment preset="night" />
        <CameraRig progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}