import React from 'react';
import type { ObjectKind } from '../engine/types';

interface FurnitureSvgProps {
  kind: ObjectKind;
}

export const FurnitureSvg: React.FC<FurnitureSvgProps> = React.memo(({ kind }) => {
  switch (kind) {
    // --- OCCUPIABLE OBJECTS (recessed, soft outline so tokens read cleanly on top) ---
    case 'chair':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="14" y="16" width="36" height="34" rx="9" fill="#E3B386" stroke="#7A5230" strokeWidth="2.5" />
          <rect x="12" y="12" width="40" height="12" rx="6" fill="#C98A56" stroke="#7A5230" strokeWidth="2.5" />
          <rect x="10" y="20" width="8" height="24" rx="4" fill="#C98A56" stroke="#7A5230" strokeWidth="2" />
          <rect x="46" y="20" width="8" height="24" rx="4" fill="#C98A56" stroke="#7A5230" strokeWidth="2" />
        </svg>
      );

    case 'rug':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="10" y="14" width="44" height="36" rx="4" fill="#E8C2B0" stroke="#9D5343" strokeWidth="2.2" />
          <rect x="16" y="20" width="32" height="24" rx="2" fill="none" stroke="#9D5343" strokeWidth="1.6" strokeDasharray="4 2" />
          <line x1="6" y1="18" x2="10" y2="18" stroke="#9D5343" strokeWidth="2" />
          <line x1="6" y1="32" x2="10" y2="32" stroke="#9D5343" strokeWidth="2" />
          <line x1="6" y1="46" x2="10" y2="46" stroke="#9D5343" strokeWidth="2" />
          <line x1="54" y1="18" x2="58" y2="18" stroke="#9D5343" strokeWidth="2" />
          <line x1="54" y1="32" x2="58" y2="32" stroke="#9D5343" strokeWidth="2" />
          <line x1="54" y1="46" x2="58" y2="46" stroke="#9D5343" strokeWidth="2" />
        </svg>
      );

    case 'sofa':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="8" y="16" width="48" height="34" rx="9" fill="#89B6B1" stroke="#36625E" strokeWidth="2.2" />
          <rect x="8" y="12" width="48" height="12" rx="5" fill="#639691" stroke="#36625E" strokeWidth="2.2" />
          <rect x="7" y="21" width="7" height="25" rx="3.5" fill="#639691" stroke="#36625E" strokeWidth="1.8" />
          <rect x="50" y="21" width="7" height="25" rx="3.5" fill="#639691" stroke="#36625E" strokeWidth="1.8" />
          <line x1="32" y1="25" x2="32" y2="49" stroke="#36625E" strokeWidth="1.6" />
        </svg>
      );

    case 'bed':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="10" width="40" height="44" rx="6" fill="#DCE6F5" stroke="#51688D" strokeWidth="2.5" />
          <rect x="12" y="24" width="40" height="30" rx="5" fill="#9BB5DB" stroke="#51688D" strokeWidth="2" />
          <rect x="16" y="14" width="14" height="9" rx="3" fill="#FFF" stroke="#51688D" strokeWidth="1.6" />
          <rect x="34" y="14" width="14" height="9" rx="3" fill="#FFF" stroke="#51688D" strokeWidth="1.6" />
        </svg>
      );

    case 'booth':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="10" y="14" width="44" height="36" rx="8" fill="#F0B89C" stroke="#8C4A32" strokeWidth="2.4" />
          <rect x="10" y="12" width="44" height="11" rx="5" fill="#D58662" stroke="#8C4A32" strokeWidth="2.2" />
          <line x1="22" y1="25" x2="22" y2="48" stroke="#8C4A32" strokeWidth="1.5" opacity="0.6" />
          <line x1="42" y1="25" x2="42" y2="48" stroke="#8C4A32" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );

    case 'stool':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="32" r="15" fill="#F5DFBA" stroke="#9B7542" strokeWidth="2.2" />
          <circle cx="32" cy="32" r="10" fill="#FCEFD7" stroke="#9B7542" strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="25" y1="25" x2="39" y2="39" stroke="#C09A63" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="39" y1="25" x2="25" y2="39" stroke="#C09A63" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="32" cy="32" r="2.2" fill="#9B7542" />
        </svg>
      );

    case 'bench':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="13" y="18" width="6" height="28" rx="2" fill="#7D582C" />
          <rect x="45" y="18" width="6" height="28" rx="2" fill="#7D582C" />
          <rect x="9" y="21" width="46" height="22" rx="4" fill="#DCBA8E" stroke="#6E4E26" strokeWidth="2.2" />
          <line x1="11" y1="28" x2="53" y2="28" stroke="#6E4E26" strokeWidth="1.5" />
          <line x1="11" y1="36" x2="53" y2="36" stroke="#6E4E26" strokeWidth="1.5" />
        </svg>
      );

    case 'car':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="10" y="16" width="44" height="32" rx="9" fill="#9AC5DF" stroke="#335C75" strokeWidth="2.5" />
          <rect x="20" y="20" width="24" height="24" rx="4" fill="#D7ECF8" stroke="#335C75" strokeWidth="1.8" />
          <circle cx="14" cy="21" r="2.5" fill="#FFF0A8" />
          <circle cx="14" cy="43" r="2.5" fill="#FFF0A8" />
        </svg>
      );

    case 'oil':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <path
            d="M18,22 C28,12 46,16 48,29 C50,41 37,50 24,46 C12,43 10,30 18,22 Z"
            fill="#565B6E"
            opacity="0.72"
            stroke="#2E3242"
            strokeWidth="2"
          />
          <ellipse cx="27" cy="27" rx="5" ry="3" fill="#92A1C2" opacity="0.5" />
        </svg>
      );

    case 'mat':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="18" width="40" height="28" rx="4" fill="#E8D7AD" stroke="#8C713B" strokeWidth="2" />
          <rect x="17" y="23" width="30" height="18" rx="2" fill="none" stroke="#8C713B" strokeWidth="1.5" />
          <line x1="23" y1="32" x2="41" y2="32" stroke="#8C713B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    // --- BLOCKING OBJECTS (dimensional, crisp top-down obstacles) ---
    case 'plant':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="34" r="14" fill="#C06C4C" stroke="#5A2F1F" strokeWidth="2.4" />
          <path d="M32 32 C22 18, 12 22, 16 32 C22 36, 28 34, 32 32Z" fill="#4C956C" stroke="#22543D" strokeWidth="2" />
          <path d="M32 32 C42 18, 52 22, 48 32 C42 36, 36 34, 32 32Z" fill="#52A375" stroke="#22543D" strokeWidth="2" />
          <path d="M32 32 C24 14, 40 14, 32 32Z" fill="#63B786" stroke="#22543D" strokeWidth="2" />
          <path d="M32 32 C22 46, 42 46, 32 32Z" fill="#3C825B" stroke="#22543D" strokeWidth="2" />
        </svg>
      );

    case 'table':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="12" width="40" height="40" rx="10" fill="#7D4C29" stroke="#3B200D" strokeWidth="2.8" />
          <rect x="17" y="17" width="30" height="30" rx="6" fill="#945C34" stroke="#573217" strokeWidth="1.5" />
          <circle cx="28" cy="29" r="5" fill="#FFFDF7" stroke="#573217" strokeWidth="1.6" />
          <path d="M33 27 H36 C37.5 27, 37.5 31, 36 31 H33" fill="none" stroke="#FFFDF7" strokeWidth="1.6" />
          <rect x="35" y="36" width="8" height="6" rx="1" fill="#F2D7A0" stroke="#573217" strokeWidth="1.2" />
        </svg>
      );

    case 'shelf':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="10" y="18" width="44" height="28" rx="4" fill="#8B5A3C" stroke="#452716" strokeWidth="2.8" />
          <rect x="15" y="23" width="8" height="18" rx="1" fill="#D65A5A" />
          <rect x="24" y="23" width="7" height="18" rx="1" fill="#4D8B9C" />
          <rect x="32" y="23" width="9" height="18" rx="1" fill="#E3B23C" />
          <rect x="42" y="23" width="7" height="18" rx="1" fill="#5D9A6B" />
        </svg>
      );

    case 'piano':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <path
            d="M14 14 H48 V30 C48 44, 34 50, 22 48 C15 47, 14 40, 14 34 Z"
            fill="#2E303E"
            stroke="#14151D"
            strokeWidth="2.5"
          />
          <rect x="16" y="14" width="30" height="8" fill="#FFF" stroke="#14151D" strokeWidth="1.5" />
          <rect x="20" y="14" width="3" height="5" fill="#14151D" />
          <rect x="26" y="14" width="3" height="5" fill="#14151D" />
          <rect x="35" y="14" width="3" height="5" fill="#14151D" />
          <rect x="41" y="14" width="3" height="5" fill="#14151D" />
        </svg>
      );

    case 'oven':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="12" width="40" height="40" rx="6" fill="#C95F49" stroke="#5D2218" strokeWidth="2.6" />
          <circle cx="24" cy="24" r="6" fill="#2A2B36" stroke="#5D2218" strokeWidth="2" />
          <circle cx="40" cy="24" r="6" fill="#2A2B36" stroke="#5D2218" strokeWidth="2" />
          <rect x="18" y="36" width="28" height="10" rx="3" fill="#F9B86D" stroke="#5D2218" strokeWidth="2" />
        </svg>
      );

    case 'display':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="14" width="40" height="36" rx="5" fill="#CFE8F2" stroke="#366277" strokeWidth="2.6" />
          <line x1="16" y1="22" x2="26" y2="18" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" />
          <polygon points="32,22 39,32 32,42 25,32" fill="#E8B93F" stroke="#7A5A0A" strokeWidth="1.8" />
        </svg>
      );

    case 'fountain':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="32" r="22" fill="#B7C0C9" stroke="#4D5863" strokeWidth="2.6" />
          <circle cx="32" cy="32" r="16" fill="#6EC2E3" stroke="#2D7591" strokeWidth="2" />
          <circle cx="32" cy="32" r="5" fill="#E9F8FE" stroke="#2D7591" strokeWidth="1.6" />
        </svg>
      );

    case 'tree':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="32" r="20" fill="#468D5B" stroke="#1E4B2B" strokeWidth="2.6" />
          <circle cx="25" cy="26" r="8" fill="#5CA872" />
          <circle cx="38" cy="30" r="9" fill="#5CA872" />
          <circle cx="31" cy="39" r="7" fill="#397A4C" />
        </svg>
      );

    case 'globe':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="32" r="18" fill="#5FA8D3" stroke="#294D69" strokeWidth="2.6" />
          <path d="M22 26 Q29 22 32 29 T42 36" fill="none" stroke="#72B872" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 38 Q26 42 30 39" fill="none" stroke="#72B872" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="32" r="21" fill="none" stroke="#C59B42" strokeWidth="2.2" strokeDasharray="32 32" />
        </svg>
      );

    case 'statue':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="16" y="16" width="32" height="32" rx="4" fill="#D5D2CA" stroke="#5A574E" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="10" fill="#F2EFE8" stroke="#5A574E" strokeWidth="2" />
          <circle cx="32" cy="32" r="4" fill="#C7C2B6" />
        </svg>
      );

    case 'easel':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <line x1="32" y1="10" x2="18" y2="52" stroke="#7A4F2B" strokeWidth="4" strokeLinecap="round" />
          <line x1="32" y1="10" x2="46" y2="52" stroke="#7A4F2B" strokeWidth="4" strokeLinecap="round" />
          <rect x="18" y="16" width="28" height="22" rx="2" fill="#FFFDF6" stroke="#5A391D" strokeWidth="2.4" />
          <circle cx="27" cy="24" r="4" fill="#E3A845" />
          <path d="M21 35 L30 27 L37 32 L43 26 V35 Z" fill="#558C9E" />
        </svg>
      );

    case 'barrel':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="32" r="19" fill="#B37544" stroke="#4D2D15" strokeWidth="2.8" />
          <circle cx="32" cy="32" r="14" fill="none" stroke="#5E6472" strokeWidth="2.2" />
          <line x1="20" y1="24" x2="44" y2="24" stroke="#4D2D15" strokeWidth="1.6" />
          <line x1="20" y1="40" x2="44" y2="40" stroke="#4D2D15" strokeWidth="1.6" />
        </svg>
      );

    case 'anchor':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <circle cx="32" cy="18" r="5" fill="none" stroke="#9B7524" strokeWidth="3.5" />
          <line x1="32" y1="23" x2="32" y2="49" stroke="#9B7524" strokeWidth="4" strokeLinecap="round" />
          <line x1="22" y1="28" x2="42" y2="28" stroke="#9B7524" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M16 39 C18 52, 46 52, 48 39" fill="none" stroke="#9B7524" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'luggage':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <rect x="12" y="18" width="40" height="28" rx="5" fill="#9E6240" stroke="#4A2917" strokeWidth="2.6" />
          <line x1="22" y1="18" x2="22" y2="46" stroke="#D9AE4E" strokeWidth="3.2" />
          <line x1="42" y1="18" x2="42" y2="46" stroke="#D9AE4E" strokeWidth="3.2" />
          <path d="M27 18 V13 H37 V18" fill="none" stroke="#4A2917" strokeWidth="2.6" />
        </svg>
      );
  }
});
