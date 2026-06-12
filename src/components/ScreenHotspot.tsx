'use client';

import { ThreeEvent } from '@react-three/fiber';
import { ScreenRect } from './ScreenHello';
import {
  ScreenId,
  focusScreen,
  setHoveredScreen,
  useScreenFocus,
} from './screenFocusStore';

// Invisible plane floated just in front of a monitor's glass. It catches
// hover/click for the expand interaction so the screens themselves don't
// have to know about it. Removed entirely while a screen is focused so the
// underlying content (music toggle, portfolio links) gets the events.
export default function ScreenHotspot({
  id,
  rect,
}: {
  id: ScreenId;
  rect: ScreenRect;
}) {
  const { focused } = useScreenFocus();
  if (focused) return null;

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredScreen(id);
    document.body.style.cursor = 'grab';
  };

  const onPointerOut = () => {
    setHoveredScreen(null);
    document.body.style.cursor = 'auto';
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // The hotspot unmounts on focus, so pointerout never fires — reset here.
    setHoveredScreen(null);
    document.body.style.cursor = 'auto';
    focusScreen(id, rect);
  };

  return (
    <mesh
      position={[rect.center.x, rect.center.y, rect.center.z + 0.01]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[rect.width, rect.height]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
