import React, { useId } from 'react';
import type { ObjectKind } from '../engine/types';

interface FurnitureSvgProps {
  kind: ObjectKind;
}

export const FurnitureSvg: React.FC<FurnitureSvgProps> = React.memo(({ kind }) => {
  const uid = useId().replace(/:/g, '');
  const g = (name: string) => `f-${uid}-${name}`;

  switch (kind) {
    // =========================================================================
    // OCCUPIABLE OBJECTS (Walkable / Sittable — unmistakable 3/4 storybook art)
    // =========================================================================

    case 'chair':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('back')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E19C62" />
              <stop offset="100%" stopColor="#B86B35" />
            </linearGradient>
            <linearGradient id={g('seat')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2BC85" />
              <stop offset="100%" stopColor="#D48C50" />
            </linearGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="56" rx="22" ry="4.5" fill="#1F1914" opacity="0.16" />
          {/* Wooden tapered legs */}
          <path d="M16 46 L14 55.5 H19 L21 47 Z" fill="#5D351A" stroke="#361D0C" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M48 46 L50 55.5 H45 L43 47 Z" fill="#5D351A" stroke="#361D0C" strokeWidth="1.6" strokeLinejoin="round" />
          {/* Tall wingback tufted backrest */}
          <path
            d="M15 34 L14 17 C14 10, 21 7, 32 7 C43 7, 50 10, 50 17 L49 34 Z"
            fill={`url(#${g('back')})`}
            stroke="#4A2711"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          {/* Backrest top highlight & tufting */}
          <path d="M20 11.5 Q32 9 44 11.5" fill="none" stroke="#F6CAA0" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <path d="M24 19 L32 24 L40 19 M32 24 L32 32" fill="none" stroke="#8A4B20" strokeWidth="1.1" opacity="0.55" />
          <circle cx="24" cy="19" r="1.7" fill="#7D411A" />
          <circle cx="40" cy="19" r="1.7" fill="#7D411A" />
          <circle cx="32" cy="24" r="1.7" fill="#7D411A" />
          {/* Plush seat cushion */}
          <rect x="14" y="31" width="36" height="13" rx="5.5" fill={`url(#${g('seat')})`} stroke="#4A2711" strokeWidth="2" />
          <path d="M19 35.5 H45" stroke="#FCE0BE" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          {/* Lower wooden apron rail */}
          <rect x="14" y="42" width="36" height="6" rx="2.5" fill="#9E5829" stroke="#4A2711" strokeWidth="1.8" />
          {/* Rolled left & right armrests */}
          <path
            d="M10 26 C8.5 26, 7.5 29, 8.5 34 L10 44 C10.5 46, 15 46, 16.5 44 L17 31 C17 27.5, 13.5 26, 10 26 Z"
            fill="#C97D45"
            stroke="#4A2711"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12.2" cy="30.2" r="3" fill="#E6A56D" stroke="#4A2711" strokeWidth="1.5" />
          <path
            d="M54 26 C55.5 26, 56.5 29, 55.5 34 L54 44 C53.5 46, 49 46, 47.5 44 L47 31 C47 27.5, 50.5 26, 54 26 Z"
            fill="#C97D45"
            stroke="#4A2711"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="51.8" cy="30.2" r="3" fill="#E6A56D" stroke="#4A2711" strokeWidth="1.5" />
        </svg>
      );

    case 'rug':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('rug')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C94B3E" />
              <stop offset="100%" stopColor="#9B2F27" />
            </linearGradient>
          </defs>
          {/* Soft floor shadow */}
          <rect x="9" y="15" width="46" height="37" rx="3" fill="#1F1914" opacity="0.14" />
          {/* Cream woven fringe tassels on left & right */}
          <g stroke="#DFC79A" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3.5" y1="16" x2="9" y2="16" />
            <line x1="3.5" y1="21.3" x2="9" y2="21.3" />
            <line x1="3.5" y1="26.6" x2="9" y2="26.6" />
            <line x1="3.5" y1="32" x2="9" y2="32" />
            <line x1="3.5" y1="37.3" x2="9" y2="37.3" />
            <line x1="3.5" y1="42.6" x2="9" y2="42.6" />
            <line x1="3.5" y1="48" x2="9" y2="48" />
            <line x1="55" y1="16" x2="60.5" y2="16" />
            <line x1="55" y1="21.3" x2="60.5" y2="21.3" />
            <line x1="55" y1="26.6" x2="60.5" y2="26.6" />
            <line x1="55" y1="32" x2="60.5" y2="32" />
            <line x1="55" y1="37.3" x2="60.5" y2="37.3" />
            <line x1="55" y1="42.6" x2="60.5" y2="42.6" />
            <line x1="55" y1="48" x2="60.5" y2="48" />
          </g>
          {/* Main Persian carpet body */}
          <rect x="8.5" y="13" width="47" height="38" rx="2.5" fill={`url(#${g('rug')})`} stroke="#5C1D18" strokeWidth="2" />
          {/* Golden outer border */}
          <rect x="12" y="16.5" width="40" height="31" rx="1" fill="none" stroke="#ECC775" strokeWidth="2.2" />
          {/* Inner teal border */}
          <rect x="15.5" y="20" width="33" height="24" rx="1" fill="#2A5863" stroke="#F7E4BA" strokeWidth="1.2" />
          {/* Inner crimson field */}
          <rect x="18" y="22.5" width="28" height="19" fill="#B53C31" />
          {/* Corner golden flourishes */}
          <circle cx="19.5" cy="24" r="1.4" fill="#F2CF7E" />
          <circle cx="44.5" cy="24" r="1.4" fill="#F2CF7E" />
          <circle cx="19.5" cy="40" r="1.4" fill="#F2CF7E" />
          <circle cx="44.5" cy="40" r="1.4" fill="#F2CF7E" />
          {/* Central Persian diamond medallion */}
          <polygon points="32,22.5 42,32 32,41.5 22,32" fill="#F6E5C0" stroke="#5C1D18" strokeWidth="1.1" />
          <polygon points="32,26 37.5,32 32,38 26.5,32" fill="#2F6673" />
          <circle cx="32" cy="32" r="2.3" fill="#E8B955" />
        </svg>
      );

    case 'sofa':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('back')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B9E96" />
              <stop offset="100%" stopColor="#3B726C" />
            </linearGradient>
            <linearGradient id={g('seat')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#84C1B9" />
              <stop offset="100%" stopColor="#56948D" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="53" rx="27" ry="4" fill="#1F1914" opacity="0.16" />
          {/* Wooden bun feet */}
          <rect x="10" y="47" width="4.5" height="6" rx="1.5" fill="#5B361C" stroke="#2D1A0C" strokeWidth="1.4" />
          <rect x="49.5" y="47" width="4.5" height="6" rx="1.5" fill="#5B361C" stroke="#2D1A0C" strokeWidth="1.4" />
          {/* Scalloped velvet backrest */}
          <path
            d="M9 34 V20 C9 14, 15 12, 22 13 C26 11, 38 11, 42 13 C49 12, 55 14, 55 20 V34 Z"
            fill={`url(#${g('back')})`}
            stroke="#214541"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Backrest cushion divisions & tuft buttons */}
          <line x1="24" y1="14" x2="24" y2="33" stroke="#28544F" strokeWidth="1.4" opacity="0.6" />
          <line x1="40" y1="14" x2="40" y2="33" stroke="#28544F" strokeWidth="1.4" opacity="0.6" />
          <circle cx="17" cy="22" r="1.4" fill="#214541" opacity="0.65" />
          <circle cx="32" cy="21" r="1.4" fill="#214541" opacity="0.65" />
          <circle cx="47" cy="22" r="1.4" fill="#214541" opacity="0.65" />
          {/* Cozy throw pillows tucked in corners */}
          <rect x="12.5" y="22.5" width="9" height="9" rx="2.5" transform="rotate(-12 17 27)" fill="#EAB854" stroke="#6E4B11" strokeWidth="1.5" />
          <rect x="42.5" y="22.5" width="9" height="9" rx="2.5" transform="rotate(12 47 27)" fill="#F3E2C2" stroke="#6E5434" strokeWidth="1.5" />
          {/* Three plush seat cushions */}
          <rect x="10" y="32" width="15" height="11" rx="3.5" fill={`url(#${g('seat')})`} stroke="#214541" strokeWidth="1.7" />
          <rect x="24.5" y="32" width="15" height="11" rx="3.5" fill={`url(#${g('seat')})`} stroke="#214541" strokeWidth="1.7" />
          <rect x="39" y="32" width="15" height="11" rx="3.5" fill={`url(#${g('seat')})`} stroke="#214541" strokeWidth="1.7" />
          {/* Velvet base trim */}
          <rect x="8.5" y="42" width="47" height="6" rx="2" fill="#3B726C" stroke="#214541" strokeWidth="1.8" />
          {/* Rolled armrests */}
          <rect x="4.5" y="25" width="7.5" height="22" rx="3.8" fill="#4C8A83" stroke="#214541" strokeWidth="1.9" />
          <circle cx="8.2" cy="29" r="2.7" fill="#77B5AD" stroke="#214541" strokeWidth="1.3" />
          <rect x="52" y="25" width="7.5" height="22" rx="3.8" fill="#4C8A83" stroke="#214541" strokeWidth="1.9" />
          <circle cx="55.8" cy="29" r="2.7" fill="#77B5AD" stroke="#214541" strokeWidth="1.3" />
        </svg>
      );

    case 'bed':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('duvet')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7098CE" />
              <stop offset="100%" stopColor="#4A6FA3" />
            </linearGradient>
          </defs>
          {/* Soft floor shadow */}
          <rect x="11" y="13" width="42" height="46" rx="4" fill="#1F1914" opacity="0.14" />
          {/* Mahogany arched headboard */}
          <path
            d="M12 20 V11 C12 8, 22 6, 32 6 C42 6, 52 8, 52 11 V20 Z"
            fill="#7B4523"
            stroke="#3E200E"
            strokeWidth="2"
          />
          <path d="M18 11.5 Q32 9 46 11.5" fill="none" stroke="#A66A3E" strokeWidth="1.4" strokeLinecap="round" />
          {/* Mattress & crisp white sheet */}
          <rect x="12" y="16" width="40" height="39" rx="4" fill="#F8FAFD" stroke="#3E200E" strokeWidth="2" />
          {/* Two puffy white pillows */}
          <rect x="15.5" y="17.5" width="14.5" height="10" rx="4" fill="#FFFFFF" stroke="#6E84A6" strokeWidth="1.5" />
          <path d="M19 22.5 Q22.7 21 26.5 22.5" fill="none" stroke="#C6D5EA" strokeWidth="1.3" strokeLinecap="round" />
          <rect x="34" y="17.5" width="14.5" height="10" rx="4" fill="#FFFFFF" stroke="#6E84A6" strokeWidth="1.5" />
          <path d="M37.5 22.5 Q41.2 21 45 22.5" fill="none" stroke="#C6D5EA" strokeWidth="1.3" strokeLinecap="round" />
          {/* Folded sheet turnover */}
          <path d="M12 29 H52 V34 H12 Z" fill="#E3ECF7" stroke="#536E96" strokeWidth="1.3" />
          {/* Quilted blue duvet */}
          <rect x="12" y="33" width="40" height="21" rx="2.5" fill={`url(#${g('duvet')})`} stroke="#355078" strokeWidth="1.8" />
          {/* Diamond quilt stitching */}
          <g stroke="#8FB4E3" strokeWidth="1.1" opacity="0.55">
            <line x1="16" y1="34" x2="34" y2="52" />
            <line x1="28" y1="34" x2="46" y2="52" />
            <line x1="48" y1="34" x2="30" y2="52" />
            <line x1="36" y1="34" x2="18" y2="52" />
          </g>
          {/* Mahogany footboard */}
          <rect x="11" y="51.5" width="42" height="5.5" rx="2" fill="#7B4523" stroke="#3E200E" strokeWidth="1.8" />
          {/* 4 Four-poster corner posts with brass finials */}
          <circle cx="11.5" cy="11.5" r="3.4" fill="#E5B64C" stroke="#593B0A" strokeWidth="1.5" />
          <circle cx="52.5" cy="11.5" r="3.4" fill="#E5B64C" stroke="#593B0A" strokeWidth="1.5" />
          <circle cx="11.5" cy="54.5" r="3.4" fill="#E5B64C" stroke="#593B0A" strokeWidth="1.5" />
          <circle cx="52.5" cy="54.5" r="3.4" fill="#E5B64C" stroke="#593B0A" strokeWidth="1.5" />
        </svg>
      );

    case 'booth':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('vinyl')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DC5B52" />
              <stop offset="100%" stopColor="#A9332D" />
            </linearGradient>
            <linearGradient id={g('bench')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC7A6E" />
              <stop offset="100%" stopColor="#C4463E" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="54" rx="26" ry="4" fill="#1F1914" opacity="0.16" />
          {/* Dark walnut diner booth outer wooden shell */}
          <path
            d="M8 15 C8 11, 12 9, 17 9 H47 C52 9, 56 11, 56 15 V47 C56 50, 53 52, 49 52 H15 C11 52, 8 50, 8 47 Z"
            fill="#6E3B20"
            stroke="#3B1D0D"
            strokeWidth="2.1"
          />
          {/* Glossy brass top trim rail */}
          <line x1="14" y1="11.5" x2="50" y2="11.5" stroke="#E8BF62" strokeWidth="1.8" strokeLinecap="round" />
          {/* Vertically channeled tufted red diner backrest */}
          <rect x="11.5" y="14" width="41" height="20" rx="4" fill={`url(#${g('vinyl')})`} stroke="#5C1A16" strokeWidth="1.8" />
          {/* Distinct vertical padded diner ribs */}
          <g stroke="#6E1E19" strokeWidth="1.6">
            <line x1="19.7" y1="14.5" x2="19.7" y2="33.5" />
            <line x1="27.9" y1="14.5" x2="27.9" y2="33.5" />
            <line x1="36.1" y1="14.5" x2="36.1" y2="33.5" />
            <line x1="44.3" y1="14.5" x2="44.3" y2="33.5" />
          </g>
          {/* Glossy vinyl sheen highlights on ribs */}
          <g stroke="#F8A89E" strokeWidth="1.4" strokeLinecap="round" opacity="0.72">
            <line x1="15.5" y1="17" x2="15.5" y2="23" />
            <line x1="23.8" y1="17" x2="23.8" y2="23" />
            <line x1="32" y1="17" x2="32" y2="23" />
            <line x1="40.2" y1="17" x2="40.2" y2="23" />
            <line x1="48.5" y1="17" x2="48.5" y2="23" />
          </g>
          {/* Deep cushioned banquette seat */}
          <rect x="11" y="33" width="42" height="13" rx="4.5" fill={`url(#${g('bench')})`} stroke="#5C1A16" strokeWidth="1.9" />
          <path d="M16 37.5 H48" stroke="#FBC0B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
          {/* Dark wood kickplate */}
          <rect x="13" y="46" width="38" height="5.5" rx="1.5" fill="#4E2813" stroke="#2D1508" strokeWidth="1.5" />
        </svg>
      );

    case 'stool':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('pad')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E66454" />
              <stop offset="100%" stopColor="#B0382C" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="56.5" rx="19" ry="3.8" fill="#1F1914" opacity="0.16" />
          {/* Back wooden legs */}
          <path d="M24 25 L20 53" stroke="#5E391B" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M40 25 L44 53" stroke="#5E391B" strokeWidth="3.6" strokeLinecap="round" />
          {/* Back section of metallic footrest ring */}
          <ellipse cx="32" cy="43.5" rx="14.5" ry="4" fill="none" stroke="#8C939E" strokeWidth="2.8" />
          {/* Front splayed wooden legs */}
          <path d="M21 24 L15.5 56" stroke="#3D220D" strokeWidth="5.4" strokeLinecap="round" />
          <path d="M21 24 L15.5 56" stroke="#9B6334" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M43 24 L48.5 56" stroke="#3D220D" strokeWidth="5.4" strokeLinecap="round" />
          <path d="M43 24 L48.5 56" stroke="#9B6334" strokeWidth="2.8" strokeLinecap="round" />
          {/* Front arc of gleaming chrome/brass footrest ring */}
          <path d="M17.5 43.5 A14.5 4.2 0 0 0 46.5 43.5" fill="none" stroke="#4D525C" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M17.5 43.5 A14.5 4.2 0 0 0 46.5 43.5" fill="none" stroke="#DCE2EC" strokeWidth="2" strokeLinecap="round" />
          {/* Padded round cushion side skirt */}
          <path
            d="M14 19 V24.5 C14 29.2, 22 32.5, 32 32.5 C42 32.5, 50 29.2, 50 24.5 V19 Z"
            fill="#9E3126"
            stroke="#4D1712"
            strokeWidth="2"
          />
          {/* Brass decorative studs around rim */}
          <g fill="#F0C65B">
            <circle cx="19" cy="25.5" r="1.2" />
            <circle cx="25" cy="27.7" r="1.2" />
            <circle cx="32" cy="28.5" r="1.2" />
            <circle cx="39" cy="27.7" r="1.2" />
            <circle cx="45" cy="25.5" r="1.2" />
          </g>
          {/* Padded round leather seat top */}
          <ellipse cx="32" cy="18.5" rx="18" ry="8.2" fill={`url(#${g('pad')})`} stroke="#4D1712" strokeWidth="2" />
          {/* Glossy top highlight */}
          <ellipse cx="28" cy="16" rx="8.5" ry="3.2" fill="#F8A99D" opacity="0.55" />
        </svg>
      );

    case 'bench':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('oak')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E6B272" />
              <stop offset="100%" stopColor="#C18544" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="54" rx="26" ry="3.6" fill="#1F1914" opacity="0.16" />
          {/* Wrought-iron rear posts & legs */}
          <path d="M13 15 L12 52 M12 43 L8.5 53" stroke="#2D333C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M51 15 L52 52 M52 43 L55.5 53" stroke="#2D333C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Three slatted warm oak backrest boards */}
          <rect x="9" y="15" width="46" height="5.5" rx="2" fill={`url(#${g('oak')})`} stroke="#5C3917" strokeWidth="1.7" />
          <rect x="9" y="22.5" width="46" height="5.5" rx="2" fill={`url(#${g('oak')})`} stroke="#5C3917" strokeWidth="1.7" />
          <rect x="9" y="30" width="46" height="4.8" rx="1.8" fill="#C98D4C" stroke="#5C3917" strokeWidth="1.6" />
          {/* Angled wooden slatted bench seat */}
          <polygon points="8,36 56,36 59,44.5 5,44.5" fill={`url(#${g('oak')})`} stroke="#5C3917" strokeWidth="1.9" strokeLinejoin="round" />
          <line x1="7" y1="40.2" x2="57" y2="40.2" stroke="#6E441B" strokeWidth="1.4" />
          {/* Iron bolt rivets on slats */}
          <g fill="#2D333C">
            <circle cx="13" cy="17.8" r="1.2" />
            <circle cx="51" cy="17.8" r="1.2" />
            <circle cx="13" cy="25.2" r="1.2" />
            <circle cx="51" cy="25.2" r="1.2" />
          </g>
          {/* Scrolled black wrought-iron armrests & front legs */}
          <path
            d="M7 33 C5 33, 4.5 36, 6.5 38 L8 45 L7.5 53.5"
            fill="none"
            stroke="#22272E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M57 33 C59 33, 59.5 36, 57.5 38 L56 45 L56.5 53.5"
            fill="none"
            stroke="#22272E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cross support bar */}
          <line x1="11" y1="48.5" x2="53" y2="48.5" stroke="#2D333C" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'car':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('body')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7CB8DC" />
              <stop offset="100%" stopColor="#4682AB" />
            </linearGradient>
            <linearGradient id={g('glass')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EFF9FF" />
              <stop offset="100%" stopColor="#A9D6EE" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <ellipse cx="32" cy="50.5" rx="26" ry="3.8" fill="#1F1914" opacity="0.18" />
          {/* Rear mounted spare tire */}
          <rect x="52.5" y="29" width="5" height="12" rx="2.5" fill="#2A2E38" stroke="#16181F" strokeWidth="1.5" />
          {/* Cabin roof & greenhouse */}
          <path
            d="M22 30 L26 17.5 C27 15.5, 29 14.5, 32 14.5 H45 C47.5 14.5, 49.5 16.5, 50.5 20 L52 30 Z"
            fill={`url(#${g('body')})`}
            stroke="#1F3E54"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Windshield & side window */}
          <path d="M27.5 28 L29.5 18.5 H38.5 V28 Z" fill={`url(#${g('glass')})`} stroke="#1F3E54" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M41 28 V18.5 H46.5 L48.5 28 Z" fill={`url(#${g('glass')})`} stroke="#1F3E54" strokeWidth="1.4" strokeLinejoin="round" />
          {/* Steering wheel silhouette inside cabin */}
          <line x1="29.5" y1="27.5" x2="32.5" y2="23.5" stroke="#2D3744" strokeWidth="1.6" strokeLinecap="round" />
          {/* Window sheen */}
          <line x1="31" y1="20" x2="35" y2="25" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
          {/* Main car body & stepped vintage hood */}
          <path
            d="M8 39 V31.5 C8 29, 10 27.5, 13.5 27.5 H52.5 C54.5 27.5, 55.5 29, 55.5 31.5 V42 H8 Z"
            fill={`url(#${g('body')})`}
            stroke="#1F3E54"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hood louver vents & door handle */}
          <g stroke="#28506B" strokeWidth="1.2" strokeLinecap="round">
            <line x1="15" y1="31" x2="15" y2="35" />
            <line x1="18" y1="31" x2="18" y2="35" />
            <line x1="21" y1="31" x2="21" y2="35" />
          </g>
          <line x1="35" y1="32" x2="39" y2="32" stroke="#E8C266" strokeWidth="1.8" strokeLinecap="round" />
          {/* Sweeping dark-navy vintage fenders & running board */}
          <path
            d="M6.5 43.5 C7 35.5, 19.5 34.5, 24 42.5 H39.5 C43.5 34.5, 55 35.5, 56 43.5 Z"
            fill="#284A63"
            stroke="#162A3A"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Brass front grille & glowing headlight */}
          <rect x="6.5" y="29" width="3.5" height="9" rx="1.2" fill="#E3B64F" stroke="#5E420D" strokeWidth="1.3" />
          <circle cx="9.5" cy="29.5" r="3" fill="#FFF2A6" stroke="#7A5714" strokeWidth="1.5" />
          {/* Red taillight */}
          <rect x="53.5" y="31" width="3" height="4" rx="1" fill="#D9453B" stroke="#5E1915" strokeWidth="1.1" />
          {/* Front & rear whitewall tires */}
          <g>
            <circle cx="16.5" cy="43.5" r="7" fill="#23262F" stroke="#111318" strokeWidth="1.6" />
            <circle cx="16.5" cy="43.5" r="4.3" fill="#F5EFE2" />
            <circle cx="16.5" cy="43.5" r="2.3" fill="#E5B952" stroke="#5C400D" strokeWidth="1.1" />
          </g>
          <g>
            <circle cx="47" cy="43.5" r="7" fill="#23262F" stroke="#111318" strokeWidth="1.6" />
            <circle cx="47" cy="43.5" r="4.3" fill="#F5EFE2" />
            <circle cx="47" cy="43.5" r="2.3" fill="#E5B952" stroke="#5C400D" strokeWidth="1.1" />
          </g>
        </svg>
      );

    case 'oil':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <radialGradient id={g('slick')} cx="42%" cy="38%" r="58%">
              <stop offset="0%" stopColor="#3B4259" />
              <stop offset="62%" stopColor="#232736" />
              <stop offset="100%" stopColor="#141722" />
            </radialGradient>
            <linearGradient id={g('rainbow1')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#56D6EC" />
              <stop offset="50%" stopColor="#C86EE8" />
              <stop offset="100%" stopColor="#F0C652" />
            </linearGradient>
            <linearGradient id={g('rainbow2')} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5BE0A8" />
              <stop offset="55%" stopColor="#5CA8F0" />
              <stop offset="100%" stopColor="#D66CC4" />
            </linearGradient>
          </defs>
          {/* Satellite oil droplets */}
          <circle cx="12" cy="20" r="3.4" fill="#1E2230" stroke="#11131C" strokeWidth="1.3" />
          <circle cx="11.2" cy="19.2" r="1" fill="#89DDF0" opacity="0.8" />
          <circle cx="53.5" cy="44" r="3.8" fill="#1E2230" stroke="#11131C" strokeWidth="1.3" />
          <circle cx="52.6" cy="43" r="1.1" fill="#D586F2" opacity="0.8" />
          <ellipse cx="49" cy="16.5" rx="4.2" ry="2.8" fill="#1E2230" stroke="#11131C" strokeWidth="1.3" />
          <circle cx="15" cy="48.5" r="2.3" fill="#232736" />
          {/* Main organic glossy black oil puddle */}
          <path
            d="M17 22 C22 13, 36 12, 43 19 C49 23, 55 28, 52 36 C49 44, 41 44, 37 49 C32 54, 20 53, 16 45 C12 39, 7 35, 10 28 C12 24, 15 24, 17 22 Z"
            fill={`url(#${g('slick')})`}
            stroke="#0F111A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Iridescent rainbow oil-sheen ribbons */}
          <path
            d="M19 26 C25 19, 37 19, 43 27 C46 31, 41 36, 35 34 C29 32, 23 32, 19 26 Z"
            fill={`url(#${g('rainbow1')})`}
            opacity="0.58"
          />
          <path
            d="M19 39 C24 44, 35 46, 42 39 C37 41, 29 38, 24 36 C21 35, 18 37, 19 39 Z"
            fill={`url(#${g('rainbow2')})`}
            opacity="0.55"
          />
          {/* Crisp wet white specular reflections */}
          <path d="M21 24 C25 19.5, 32 18.8, 36 20.5" fill="none" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" opacity="0.82" />
          <circle cx="15.5" cy="31" r="1.6" fill="#FFFFFF" opacity="0.65" />
          <path d="M44.5 31 C46.5 33, 46 36, 43.5 37.5" fill="none" stroke="#B6EEFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.72" />
        </svg>
      );

    case 'mat':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('coir')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E4C185" />
              <stop offset="100%" stopColor="#C49A58" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <rect x="6" y="18" width="52" height="33" rx="4" fill="#1F1914" opacity="0.16" />
          {/* Natural woven coir mat body */}
          <rect x="5" y="15" width="54" height="34" rx="3.5" fill={`url(#${g('coir')})`} stroke="#6B4720" strokeWidth="2.2" />
          {/* Dark cocoa decorative border */}
          <rect x="9" y="19" width="46" height="26" rx="1.5" fill="none" stroke="#6B4720" strokeWidth="1.6" />
          {/* Subtle woven coir texture ticks */}
          <g stroke="#966A33" strokeWidth="1.1" strokeLinecap="round" opacity="0.5">
            <line x1="12" y1="22.5" x2="15" y2="22.5" />
            <line x1="49" y1="22.5" x2="52" y2="22.5" />
            <line x1="12" y1="41.5" x2="15" y2="41.5" />
            <line x1="49" y1="41.5" x2="52" y2="41.5" />
            <line x1="25" y1="22.5" x2="39" y2="22.5" />
            <line x1="25" y1="41.5" x2="39" y2="41.5" />
          </g>
          {/* Crisp WELCOME lettering */}
          <text
            x="32"
            y="34.8"
            textAnchor="middle"
            fill="#472B10"
            fontSize="7.4"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.2"
          >
            WELCOME
          </text>
        </svg>
      );

    // =========================================================================
    // BLOCKING OBJECTS (Solid Obstacles — rich 3/4 illustrated board pieces)
    // =========================================================================

    case 'plant':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('pot')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#DF7E55" />
              <stop offset="55%" stopColor="#C25E3A" />
              <stop offset="100%" stopColor="#994326" />
            </linearGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="56.5" rx="16" ry="3.6" fill="#1F1914" opacity="0.18" />
          {/* Back darker botanical leaves */}
          <path d="M32 34 C22 25, 11 26, 8 18 C17 15, 27 20, 32 34 Z" fill="#2A6E47" stroke="#163F28" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M32 34 C42 25, 53 26, 56 18 C47 15, 37 20, 32 34 Z" fill="#2A6E47" stroke="#163F28" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M32 33 C25 18, 25 9, 32 6 C39 9, 39 18, 32 33 Z" fill="#3B8A5B" stroke="#163F28" strokeWidth="1.9" strokeLinejoin="round" />
          {/* Mid bright leaves */}
          <path d="M31 35 C20 31, 12 34, 10 27 C17 24, 25 27, 31 35 Z" fill="#4BA36C" stroke="#163F28" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M33 35 C44 31, 52 34, 54 27 C47 24, 39 27, 33 35 Z" fill="#52AD74" stroke="#163F28" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M32 35 C21 22, 17 14, 21 10 C28 12, 32 22, 32 35 Z" fill="#59B87B" stroke="#163F28" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M32 35 C43 22, 47 14, 43 10 C36 12, 32 22, 32 35 Z" fill="#489F69" stroke="#163F28" strokeWidth="1.7" strokeLinejoin="round" />
          {/* Delicate leaf center veins */}
          <g stroke="#9BE0B0" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
            <line x1="32" y1="29" x2="32" y2="11" />
            <line x1="29" y1="30" x2="21.5" y2="15" />
            <line x1="35" y1="30" x2="42.5" y2="15" />
            <line x1="28" y1="33" x2="14" y2="28" />
            <line x1="36" y1="33" x2="50" y2="28" />
          </g>
          {/* Terracotta tapered flowerpot */}
          <path d="M20 38 H44 L40.5 55.5 H23.5 Z" fill={`url(#${g('pot')})`} stroke="#572614" strokeWidth="2" strokeLinejoin="round" />
          {/* Dark potting soil */}
          <ellipse cx="32" cy="36.5" rx="13" ry="3" fill="#472D1C" />
          {/* Rolled terracotta pot rim */}
          <rect x="17" y="34" width="30" height="6.5" rx="2.5" fill="#D9734C" stroke="#572614" strokeWidth="2" />
          <line x1="21" y1="36.5" x2="31" y2="36.5" stroke="#F4AD8E" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'table':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('top')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B87844" />
              <stop offset="100%" stopColor="#854E24" />
            </linearGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="56" rx="24" ry="4" fill="#1F1914" opacity="0.16" />
          {/* Back wooden legs */}
          <rect x="17" y="34" width="4" height="19" rx="1.5" fill="#593216" stroke="#301909" strokeWidth="1.5" />
          <rect x="43" y="34" width="4" height="19" rx="1.5" fill="#593216" stroke="#301909" strokeWidth="1.5" />
          {/* Front wooden legs */}
          <rect x="11" y="32" width="4.8" height="24" rx="1.8" fill="#7D4924" stroke="#301909" strokeWidth="1.7" />
          <rect x="48.2" y="32" width="4.8" height="24" rx="1.8" fill="#7D4924" stroke="#301909" strokeWidth="1.7" />
          {/* Apron with drawer & brass knob */}
          <rect x="13" y="31" width="38" height="9" rx="1.5" fill="#73421F" stroke="#301909" strokeWidth="1.8" />
          <rect x="22" y="33" width="20" height="5.5" rx="1" fill="#8B532A" stroke="#3B200D" strokeWidth="1.2" />
          <circle cx="32" cy="35.8" r="1.6" fill="#ECC05B" stroke="#5C400D" strokeWidth="0.9" />
          {/* Angled wooden tabletop */}
          <polygon points="12,18 52,18 57,31 7,31" fill={`url(#${g('top')})`} stroke="#3B200D" strokeWidth="2.1" strokeLinejoin="round" />
          {/* Beveled front tabletop thickness */}
          <rect x="7" y="29.5" width="50" height="4" rx="1.5" fill="#75431F" stroke="#3B200D" strokeWidth="1.7" />
          {/* Teacup & saucer on left */}
          <ellipse cx="23.5" cy="25" rx="6.2" ry="2.4" fill="#F2EFE8" stroke="#5E584D" strokeWidth="1.2" />
          <path d="M19.5 20.5 H27.5 V23.5 C27.5 25.5, 19.5 25.5, 19.5 23.5 Z" fill="#FFFFFF" stroke="#5E584D" strokeWidth="1.3" />
          <path d="M27.5 21.2 C29.8 21.2, 29.8 24, 27.5 24" fill="none" stroke="#5E584D" strokeWidth="1.3" />
          <path d="M22 17 Q23.5 14.5 22.5 12.5 M25 17.5 Q26.5 15 25.5 13" fill="none" stroke="#8C99A8" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
          {/* Little red hardcover book on right */}
          <polygon points="35,20 47,21.5 45,27 33,25.5" fill="#C44137" stroke="#591A15" strokeWidth="1.4" strokeLinejoin="round" />
          <line x1="34" y1="26.2" x2="45.5" y2="27.6" stroke="#F7ECCE" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'shelf':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('wood')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9A613A" />
              <stop offset="100%" stopColor="#724324" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="57.5" rx="23" ry="3.2" fill="#1F1914" opacity="0.16" />
          {/* Main upright bookcase cabinet */}
          <rect x="11" y="9" width="42" height="47" rx="2.5" fill={`url(#${g('wood')})`} stroke="#3B2010" strokeWidth="2.1" />
          {/* Top crown molding */}
          <rect x="8.5" y="6.5" width="47" height="4.5" rx="1.8" fill="#A86D43" stroke="#3B2010" strokeWidth="1.9" />
          {/* Recessed dark interior shelves */}
          <rect x="15" y="13" width="34" height="11.5" fill="#462815" />
          <rect x="15" y="27.5" width="34" height="11.5" fill="#462815" />
          <rect x="15" y="42" width="34" height="11" fill="#462815" />
          {/* Shelf 1 books */}
          <rect x="16.5" y="15" width="5.5" height="9.5" rx="0.8" fill="#D44E46" stroke="#3B1513" strokeWidth="1.1" />
          <rect x="22.3" y="14" width="6" height="10.5" rx="0.8" fill="#3D7B94" stroke="#183440" strokeWidth="1.1" />
          <rect x="28.6" y="15.8" width="5.2" height="8.7" rx="0.8" fill="#E6B645" stroke="#5C440C" strokeWidth="1.1" />
          <rect x="34.1" y="14.5" width="5.8" height="10" rx="0.8" fill="#4D9464" stroke="#1E4229" strokeWidth="1.1" />
          <rect x="41.2" y="15.2" width="5.2" height="9.3" rx="0.8" transform="rotate(-11 43.8 20)" fill="#8B5EA3" stroke="#3C234A" strokeWidth="1.1" />
          {/* Shelf 2 books + little golden vase */}
          <rect x="16.5" y="29" width="5.5" height="10" rx="0.8" fill="#E07D42" stroke="#5C2D12" strokeWidth="1.1" />
          <rect x="22.3" y="29.8" width="5.2" height="9.2" rx="0.8" fill="#4868A6" stroke="#1B2A47" strokeWidth="1.1" />
          <rect x="27.8" y="28.5" width="6" height="10.5" rx="0.8" fill="#C94B5C" stroke="#541922" strokeWidth="1.1" />
          {/* Little ceramic vase */}
          <path d="M40 39 C38 37, 38.5 33, 41 32 V30.5 H44 V32 C46.5 33, 47 37, 45 39 Z" fill="#F0C660" stroke="#63480F" strokeWidth="1.2" />
          {/* Shelf 3 stacked & upright books */}
          <rect x="16.5" y="49.2" width="12.5" height="3.8" rx="0.8" fill="#4B917E" stroke="#1B3D34" strokeWidth="1.1" />
          <rect x="17.5" y="45.5" width="11" height="3.7" rx="0.8" fill="#D9534F" stroke="#591C1A" strokeWidth="1.1" />
          <rect x="31.5" y="43.5" width="5.5" height="9.5" rx="0.8" fill="#E5B749" stroke="#5C440C" strokeWidth="1.1" />
          <rect x="37.3" y="44.2" width="5.2" height="8.8" rx="0.8" fill="#426D9C" stroke="#1A2E45" strokeWidth="1.1" />
          <rect x="42.8" y="43" width="5.2" height="10" rx="0.8" fill="#B84B3E" stroke="#4F1A14" strokeWidth="1.1" />
          {/* Crisp horizontal shelf planks */}
          <rect x="13" y="24.5" width="38" height="3" fill="#B5794B" stroke="#3B2010" strokeWidth="1.2" />
          <rect x="13" y="39" width="38" height="3" fill="#B5794B" stroke="#3B2010" strokeWidth="1.2" />
        </svg>
      );

    case 'piano':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('ebony')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B3F52" />
              <stop offset="100%" stopColor="#171923" />
            </linearGradient>
            <linearGradient id={g('harp')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6BA52" />
              <stop offset="100%" stopColor="#AD7E22" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="56" rx="24" ry="3.8" fill="#1F1914" opacity="0.18" />
          {/* Three tapered ebony legs + brass pedal lyre */}
          <path d="M13 42 L11.5 55 H15.5 L17 42 Z" fill="#1A1C26" stroke="#0D0E14" strokeWidth="1.5" />
          <path d="M41 42 L42.5 55 H38.5 L37 42 Z" fill="#1A1C26" stroke="#0D0E14" strokeWidth="1.5" />
          <path d="M50 37 L51.5 51 H48 L47 37 Z" fill="#1A1C26" stroke="#0D0E14" strokeWidth="1.4" />
          <path d="M25 43 V52 H31 V43" fill="none" stroke="#1A1C26" strokeWidth="2" />
          <line x1="24" y1="52.5" x2="32" y2="52.5" stroke="#E5B74C" strokeWidth="2.4" strokeLinecap="round" />
          {/* Propped-open grand piano lid */}
          <path
            d="M11 26 L23 8 C35 6, 48 10, 54 18 L52 27 Z"
            fill={`url(#${g('ebony')})`}
            stroke="#0D0E14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M24 12 C34 10.5, 43 13, 49 18" fill="none" stroke="#6B7291" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
          {/* Golden brass harp soundboard & strings inside */}
          <path d="M15 28 L49 21 L53 31 L14 34 Z" fill={`url(#${g('harp')})`} stroke="#5C400D" strokeWidth="1.4" />
          <g stroke="#7A5612" strokeWidth="0.9" opacity="0.75">
            <line x1="20" y1="31" x2="44" y2="23" />
            <line x1="24" y1="32" x2="47" y2="25" />
            <line x1="29" y1="33" x2="49" y2="27" />
          </g>
          {/* Brass lid prop stick */}
          <line x1="46" y1="28" x2="49" y2="17" stroke="#F0C75E" strokeWidth="2" strokeLinecap="round" />
          {/* Curved grand piano body */}
          <path
            d="M9 32 H54 V39 C54 42, 48 43, 43 43 H9 Z"
            fill={`url(#${g('ebony')})`}
            stroke="#0D0E14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* White sheet music on desk */}
          <polygon points="22,22 34,22 35,31 21,31" fill="#FFFDF5" stroke="#4D483F" strokeWidth="1.3" />
          <line x1="24" y1="25" x2="32" y2="25" stroke="#8C867B" strokeWidth="1" />
          <line x1="24" y1="27.8" x2="32" y2="27.8" stroke="#8C867B" strokeWidth="1" />
          {/* Iconic black & white piano keyboard across the front */}
          <rect x="11" y="34" width="32" height="8" rx="1" fill="#FFFFFF" stroke="#0D0E14" strokeWidth="1.6" />
          {/* White key dividers */}
          <g stroke="#C8CCD4" strokeWidth="0.9">
            <line x1="15" y1="34" x2="15" y2="42" />
            <line x1="19" y1="34" x2="19" y2="42" />
            <line x1="23" y1="34" x2="23" y2="42" />
            <line x1="27" y1="34" x2="27" y2="42" />
            <line x1="31" y1="34" x2="31" y2="42" />
            <line x1="35" y1="34" x2="35" y2="42" />
            <line x1="39" y1="34" x2="39" y2="42" />
          </g>
          {/* Black keys in 2s and 3s */}
          <g fill="#14161F">
            <rect x="13.6" y="34" width="2.6" height="4.8" rx="0.5" />
            <rect x="17.6" y="34" width="2.6" height="4.8" rx="0.5" />
            <rect x="25.6" y="34" width="2.6" height="4.8" rx="0.5" />
            <rect x="29.6" y="34" width="2.6" height="4.8" rx="0.5" />
            <rect x="33.6" y="34" width="2.6" height="4.8" rx="0.5" />
          </g>
        </svg>
      );

    case 'oven':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('brick')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CC5F45" />
              <stop offset="100%" stopColor="#993A26" />
            </linearGradient>
            <linearGradient id={g('fire')} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FF6A1A" />
              <stop offset="55%" stopColor="#FFB02E" />
              <stop offset="100%" stopColor="#FFF08A" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="56.5" rx="24" ry="3.6" fill="#1F1914" opacity="0.18" />
          {/* Little smoke puffs from chimney */}
          <circle cx="33" cy="5.5" r="2.2" fill="#D5D8DE" opacity="0.8" />
          <circle cx="37" cy="4" r="1.6" fill="#E3E6EB" opacity="0.7" />
          {/* Brick chimney flue */}
          <rect x="26" y="8" width="12" height="10" rx="1.5" fill="#B54D36" stroke="#521D13" strokeWidth="1.9" />
          <rect x="24" y="7.5" width="16" height="3.2" rx="1" fill="#8C8982" stroke="#42403C" strokeWidth="1.4" />
          {/* Domed brick bakery oven body */}
          <path
            d="M11 49 V34 C11 20, 20 15, 32 15 C44 15, 53 20, 53 34 V49 Z"
            fill={`url(#${g('brick')})`}
            stroke="#521D13"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          {/* Staggered masonry brick courses */}
          <g stroke="#6B271A" strokeWidth="1.2" opacity="0.65">
            <line x1="16" y1="23" x2="48" y2="23" />
            <line x1="12" y1="30" x2="52" y2="30" />
            <line x1="12" y1="38" x2="19" y2="38" />
            <line x1="45" y1="38" x2="52" y2="38" />
            <line x1="25" y1="16" x2="25" y2="23" />
            <line x1="39" y1="16" x2="39" y2="23" />
            <line x1="19" y1="23" x2="19" y2="30" />
            <line x1="32" y1="23" x2="32" y2="30" />
            <line x1="45" y1="23" x2="45" y2="30" />
          </g>
          {/* Arched stone/brick fire-mouth surround */}
          <path
            d="M18 49 V38 C18 29.5, 24 26, 32 26 C40 26, 46 29.5, 46 38 V49 Z"
            fill="#DF8E5D"
            stroke="#521D13"
            strokeWidth="1.9"
          />
          {/* Dark interior hearth opening */}
          <path d="M21.5 49 V39 C21.5 33, 26 30, 32 30 C38 30, 42.5 33, 42.5 39 V49 Z" fill="#2A1410" />
          {/* Glowing roaring bakery fire */}
          <path
            d="M24 49 C23 43, 26.5 40, 28 36 C30 39, 31 35, 32.5 33.5 C34.5 36.5, 35.5 40, 37.5 37.5 C40 41, 41 44.5, 40 49 Z"
            fill={`url(#${g('fire')})`}
          />
          <path
            d="M27.5 49 C27.5 45, 30 43, 32 40.5 C34 43, 36.5 45, 36.5 49 Z"
            fill="#FFF4A3"
          />
          {/* Heavy stone hearth ledge */}
          <rect x="8" y="48.5" width="48" height="6.5" rx="2" fill="#A6A39B" stroke="#45433E" strokeWidth="2" />
          <line x1="12" y1="51" x2="52" y2="51" stroke="#D5D2CA" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'display':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('glass')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2FBFF" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#AEDCF0" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id={g('gem')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE87A" />
              <stop offset="100%" stopColor="#D69115" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="57" rx="22" ry="3.5" fill="#1F1914" opacity="0.16" />
          {/* Wooden museum pedestal base */}
          <rect x="13" y="38" width="38" height="17" rx="2" fill="#6E4124" stroke="#361D0E" strokeWidth="2" />
          <rect x="10" y="52.5" width="44" height="4.5" rx="1.5" fill="#59321A" stroke="#361D0E" strokeWidth="1.8" />
          {/* Brass museum plaque on pedestal */}
          <rect x="23" y="43.5" width="18" height="6" rx="1" fill="#E5BE5C" stroke="#5E430E" strokeWidth="1.2" />
          <line x1="26" y1="46.5" x2="38" y2="46.5" stroke="#7A5714" strokeWidth="1.2" strokeLinecap="round" />
          {/* Translucent glass backdrop */}
          <rect x="13.5" y="10" width="37" height="28.5" rx="2" fill={`url(#${g('glass')})`} />
          {/* Crimson velvet display cushion */}
          <path d="M18 38 C20 33, 44 33, 46 38 Z" fill="#B52B2B" stroke="#521212" strokeWidth="1.5" />
          {/* Gleaming golden crown inside case */}
          <polygon
            points="21.5,34 23.5,20 28.5,26 32,17 35.5,26 40.5,20 42.5,34"
            fill={`url(#${g('gem')})`}
            stroke="#6E4606"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="29.5" r="2.2" fill="#DC3636" stroke="#6E1414" strokeWidth="0.7" />
          <circle cx="26.5" cy="30" r="1.5" fill="#2E7BC4" />
          <circle cx="37.5" cy="30" r="1.5" fill="#2E7BC4" />
          {/* Crisp glass hood border & reflections in front */}
          <rect x="13.5" y="10" width="37" height="28.5" rx="2" fill="none" stroke="#366B82" strokeWidth="2.1" />
          <rect x="12" y="8" width="40" height="3.5" rx="1.2" fill="#D6AA49" stroke="#5C410D" strokeWidth="1.5" />
          <line x1="16.5" y1="13.5" x2="22" y2="19" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
          <line x1="16.5" y1="19.5" x2="19.5" y2="22.5" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
          {/* Sparkle star */}
          <path d="M44.5 14 L45.5 16.5 L48 17.5 L45.5 18.5 L44.5 21 L43.5 18.5 L41 17.5 L43.5 16.5 Z" fill="#FFFFFF" stroke="#5E8FA6" strokeWidth="0.5" />
        </svg>
      );

    case 'fountain':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('stone')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DDE2E8" />
              <stop offset="100%" stopColor="#9FA8B3" />
            </linearGradient>
            <linearGradient id={g('water')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#72D1F0" />
              <stop offset="100%" stopColor="#3595BD" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="55.5" rx="25" ry="4" fill="#1F1914" opacity="0.16" />
          {/* Stone lower basin outer wall */}
          <path
            d="M8 40 C8 49, 17 55, 32 55 C47 55, 56 49, 56 40 Z"
            fill={`url(#${g('stone')})`}
            stroke="#4B5561"
            strokeWidth="2"
          />
          {/* Rim & vivid turquoise pool */}
          <ellipse cx="32" cy="40" rx="24" ry="8.5" fill="#D5DBE2" stroke="#4B5561" strokeWidth="2" />
          <ellipse cx="32" cy="40" rx="20" ry="6" fill={`url(#${g('water')})`} stroke="#286E8C" strokeWidth="1.3" />
          {/* Water ripples */}
          <ellipse cx="32" cy="40.5" rx="13" ry="3.2" fill="none" stroke="#E0F7FF" strokeWidth="1.2" strokeDasharray="5 3" />
          {/* Central fluted stone column */}
          <rect x="27.5" y="25" width="9" height="16" rx="2" fill={`url(#${g('stone')})`} stroke="#4B5561" strokeWidth="1.8" />
          {/* Upper stone tier bowl */}
          <path d="M19 24 C19 29, 25 31.5, 32 31.5 C39 31.5, 45 29, 45 24 Z" fill={`url(#${g('stone')})`} stroke="#4B5561" strokeWidth="1.8" />
          <ellipse cx="32" cy="24" rx="13" ry="3.6" fill="#63C7E8" stroke="#4B5561" strokeWidth="1.6" />
          {/* Top finial spout */}
          <path d="M29.5 24 L31 15.5 H33 L34.5 24 Z" fill="#C9D0D9" stroke="#4B5561" strokeWidth="1.5" />
          {/* Graceful spraying water arcs */}
          <g fill="none" stroke="#5BC8EC" strokeWidth="2.4" strokeLinecap="round">
            <path d="M32 15 C28 7, 19 9, 20 22" />
            <path d="M32 15 C36 7, 45 9, 44 22" />
            <path d="M21 25.5 C16 28, 15 34, 16.5 39" />
            <path d="M43 25.5 C48 28, 49 34, 47.5 39" />
          </g>
          {/* White foam highlight arcs & droplets */}
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
            <path d="M32 14 C28.5 8, 22 9.5, 21.5 17" />
            <path d="M32 14 C35.5 8, 42 9.5, 42.5 17" />
          </g>
          <circle cx="32" cy="11" r="1.7" fill="#FFFFFF" />
          <circle cx="16.5" cy="39" r="1.5" fill="#E6F9FF" />
          <circle cx="47.5" cy="39" r="1.5" fill="#E6F9FF" />
        </svg>
      );

    case 'tree':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('trunk')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#946037" />
              <stop offset="100%" stopColor="#633C1E" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <ellipse cx="32" cy="56.5" rx="18" ry="3.8" fill="#1F1914" opacity="0.17" />
          {/* Wooden/stone garden planter box or grassy base */}
          <path d="M21 47 H43 L40.5 56 H23.5 Z" fill="#C46A46" stroke="#592816" strokeWidth="1.9" strokeLinejoin="round" />
          <rect x="19" y="44.5" width="26" height="4" rx="1.4" fill="#D97C56" stroke="#592816" strokeWidth="1.7" />
          {/* Tree trunk & Y-fork branches */}
          <path
            d="M28.5 45 V33 L24 28 M35.5 45 V33 L40 28"
            fill="none"
            stroke="#422611"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="28.5" y="31" width="7" height="14" fill={`url(#${g('trunk')})`} stroke="#422611" strokeWidth="1.8" />
          {/* Multi-layered sculpted leafy crown */}
          <circle cx="21" cy="27" r="11.5" fill="#2E7544" stroke="#184225" strokeWidth="2" />
          <circle cx="43" cy="27" r="11.5" fill="#2E7544" stroke="#184225" strokeWidth="2" />
          <circle cx="32" cy="18" r="13" fill="#3D8E53" stroke="#184225" strokeWidth="2" />
          <circle cx="25" cy="24" r="9.5" fill="#4CA361" />
          <circle cx="39" cy="25" r="9.5" fill="#45995A" />
          <circle cx="32" cy="27" r="10" fill="#3C8D52" />
          {/* Sunlit leaf cluster highlights */}
          <circle cx="28" cy="14" r="5.5" fill="#6AC278" opacity="0.85" />
          <circle cx="20" cy="22" r="4" fill="#64BC73" opacity="0.8" />
          <circle cx="40" cy="20" r="4.2" fill="#60B66F" opacity="0.75" />
          {/* Cute tiny garden blossoms */}
          <circle cx="23" cy="26" r="1.8" fill="#FFF3B0" />
          <circle cx="37" cy="17" r="1.8" fill="#FFD1C7" />
          <circle cx="42" cy="29" r="1.7" fill="#FFF3B0" />
          <circle cx="30" cy="23" r="1.6" fill="#FFD1C7" />
        </svg>
      );

    case 'globe':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <radialGradient id={g('ocean')} cx="36%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#77C2EA" />
              <stop offset="65%" stopColor="#4590C2" />
              <stop offset="100%" stopColor="#265D87" />
            </radialGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="57" rx="16" ry="3.2" fill="#1F1914" opacity="0.16" />
          {/* Turned mahogany wooden pedestal stand */}
          <path d="M29.5 47 H34.5 L36 53 H28 Z" fill="#7D4924" stroke="#3B200D" strokeWidth="1.7" />
          <path d="M18 56 C18 52.5, 24 51.5, 32 51.5 C40 51.5, 46 52.5, 46 56 Z" fill="#94582D" stroke="#3B200D" strokeWidth="1.9" />
          {/* Ocean sphere */}
          <circle cx="32" cy="27" r="16.5" fill={`url(#${g('ocean')})`} stroke="#1D4463" strokeWidth="2" />
          {/* Subtle latitude / longitude grid */}
          <ellipse cx="32" cy="27" rx="16.5" ry="5.5" fill="none" stroke="#9ED8F5" strokeWidth="0.9" opacity="0.5" />
          <ellipse cx="32" cy="27" rx="7.5" ry="16.5" fill="none" stroke="#9ED8F5" strokeWidth="0.9" opacity="0.5" />
          {/* Recognizable stylized green continents */}
          <path
            d="M21 19 C24 16, 30 16, 31 20 C32 23, 28 25, 29 29 C30 33, 27 37, 24 35 C22 33, 23 29, 20 26 C18 24, 19 21, 21 19 Z"
            fill="#6EB86B"
            stroke="#2E6632"
            strokeWidth="1.1"
          />
          <path
            d="M36 16 C40 16, 44 19, 45 23 C43 26, 40 25, 41 29 C42 33, 39 36, 36 34 C34 32, 35 28, 34 24 C33 20, 34 17, 36 16 Z"
            fill="#76C272"
            stroke="#2E6632"
            strokeWidth="1.1"
          />
          {/* Glossy sphere highlight */}
          <ellipse cx="26" cy="20" rx="4.5" ry="2.6" transform="rotate(-30 26 20)" fill="#FFFFFF" opacity="0.55" />
          {/* Curved golden brass meridian C-arm */}
          <path
            d="M24 9.5 C40 6, 52.5 16.5, 50.5 31 C49 42.5, 39.5 47.5, 32 47.5"
            fill="none"
            stroke="#6B4A0E"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M24 9.5 C40 6, 52.5 16.5, 50.5 31 C49 42.5, 39.5 47.5, 32 47.5"
            fill="none"
            stroke="#E8BD52"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Tilted brass axis pins */}
          <circle cx="25.5" cy="11.5" r="2.2" fill="#E8BD52" stroke="#5E410C" strokeWidth="1.2" />
          <circle cx="38.5" cy="43" r="2.2" fill="#E8BD52" stroke="#5E410C" strokeWidth="1.2" />
        </svg>
      );

    case 'statue':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('marble')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FAF8F2" />
              <stop offset="65%" stopColor="#E4E0D5" />
              <stop offset="100%" stopColor="#C4BFB1" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="57.5" rx="18" ry="3.2" fill="#1F1914" opacity="0.17" />
          {/* Classical stepped Greek marble pedestal */}
          <rect x="16" y="52.5" width="32" height="4.5" rx="1.2" fill="#D9D4C8" stroke="#524E46" strokeWidth="1.8" />
          <rect x="20" y="42.5" width="24" height="10.5" fill="#E8E4DA" stroke="#524E46" strokeWidth="1.8" />
          <rect x="18" y="40" width="28" height="3.5" rx="1" fill="#F2EFE7" stroke="#524E46" strokeWidth="1.7" />
          {/* Pedestal flutes */}
          <g stroke="#9B968A" strokeWidth="1.2">
            <line x1="25" y1="44.5" x2="25" y2="51" />
            <line x1="32" y1="44.5" x2="32" y2="51" />
            <line x1="39" y1="44.5" x2="39" y2="51" />
          </g>
          {/* Draped classical bust shoulders */}
          <path
            d="M17 40 C17 33, 23 30, 32 30 C41 30, 47 33, 47 40 Z"
            fill={`url(#${g('marble')})`}
            stroke="#524E46"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Toga drapery folds */}
          <path d="M22 39 Q32 34 42 39" fill="none" stroke="#9C978B" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M25 34.5 Q32 37.5 39 34.5" fill="none" stroke="#9C978B" strokeWidth="1.2" strokeLinecap="round" />
          {/* Sculpted neck */}
          <rect x="28.5" y="25.5" width="7" height="6.5" rx="2" fill="#ECE8DF" stroke="#524E46" strokeWidth="1.6" />
          {/* Sculpted marble head */}
          <path
            d="M23.5 18.5 C23.5 11.5, 40.5 11.5, 40.5 18.5 C40.5 25, 36.5 28.5, 32 28.5 C27.5 28.5, 23.5 25, 23.5 18.5 Z"
            fill={`url(#${g('marble')})`}
            stroke="#524E46"
            strokeWidth="1.9"
          />
          {/* Classical curly Roman hair crown */}
          <path
            d="M22.5 18 C21.5 13, 24.5 9.5, 28 10 C30 7.5, 34 7.5, 36 10 C39.5 9.5, 42.5 13, 41.5 18 C39 14.5, 25 14.5, 22.5 18 Z"
            fill="#EAE6DC"
            stroke="#524E46"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Subtle classical brow, nose & chin chisel lines */}
          <path d="M27 18.5 H30.5 M33.5 18.5 H37" stroke="#858075" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M32 18.5 L31.2 22.2 H33" fill="none" stroke="#858075" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M29.5 24.8 Q32 25.8 34.5 24.8" fill="none" stroke="#858075" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      );

    case 'easel':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ED5F0" />
              <stop offset="100%" stopColor="#FCE7B2" />
            </linearGradient>
          </defs>
          {/* Floor shadow */}
          <ellipse cx="32" cy="56.5" rx="20" ry="3.4" fill="#1F1914" opacity="0.16" />
          {/* Wooden A-frame easel legs */}
          <line x1="32" y1="7.5" x2="32" y2="52" stroke="#6E4422" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="32" y1="7.5" x2="14" y2="56" stroke="#4D2D13" strokeWidth="5.2" strokeLinecap="round" />
          <line x1="32" y1="7.5" x2="14" y2="56" stroke="#9E683B" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="32" y1="7.5" x2="50" y2="56" stroke="#4D2D13" strokeWidth="5.2" strokeLinecap="round" />
          <line x1="32" y1="7.5" x2="50" y2="56" stroke="#9E683B" strokeWidth="2.6" strokeLinecap="round" />
          {/* Top wooden clamp */}
          <rect x="27.5" y="10" width="9" height="4" rx="1" fill="#8A552A" stroke="#4D2D13" strokeWidth="1.4" />
          {/* Framed canvas painting */}
          <rect x="14.5" y="13.5" width="35" height="27.5" rx="2" fill="#FFFDF8" stroke="#5C381B" strokeWidth="2.2" />
          {/* Vivid miniature landscape painting */}
          <rect x="17.5" y="16.5" width="29" height="21.5" fill={`url(#${g('sky')})`} />
          <circle cx="24" cy="22.5" r="3.6" fill="#F2AE30" />
          <polygon points="17.5,38 27,25 34.5,32 41,23.5 46.5,31 46.5,38" fill="#467E94" />
          <path d="M17.5 38 Q28 31 38 35 T46.5 34 V38 Z" fill="#5CA363" />
          {/* Wooden ledge tray */}
          <rect x="11" y="40" width="42" height="4.2" rx="1.5" fill="#A66D3E" stroke="#4D2D13" strokeWidth="1.8" />
          {/* Cute artist's palette with colorful paint dabs */}
          <path
            d="M36 45 C36 39.5, 48 39, 51 43.5 C53 46.5, 50 51.5, 44 51.5 C39 51.5, 36 48.5, 36 45 Z"
            fill="#E8C794"
            stroke="#5C3D1A"
            strokeWidth="1.6"
          />
          <circle cx="40.5" cy="44" r="1.6" fill="#D9453B" />
          <circle cx="44.5" cy="43" r="1.6" fill="#E8B938" />
          <circle cx="48" cy="45.2" r="1.6" fill="#3B7DC4" />
          <circle cx="45.5" cy="48.5" r="1.5" fill="#4CA35C" />
          <circle cx="40.2" cy="48" r="1.4" fill="#FFFDF8" stroke="#5C3D1A" strokeWidth="0.9" />
        </svg>
      );

    case 'barrel':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('stave')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9C6030" />
              <stop offset="40%" stopColor="#C9884E" />
              <stop offset="80%" stopColor="#A66734" />
              <stop offset="100%" stopColor="#7A461E" />
            </linearGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="56" rx="19" ry="3.8" fill="#1F1914" opacity="0.18" />
          {/* Bulging upright oak barrel body */}
          <path
            d="M17 14 C11.5 26, 11.5 40, 17 53 C22 56, 42 56, 47 53 C52.5 40, 52.5 26, 47 14 Z"
            fill={`url(#${g('stave')})`}
            stroke="#4A2710"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          {/* Curved wooden stave seams */}
          <g fill="none" stroke="#5C3114" strokeWidth="1.35" opacity="0.72">
            <path d="M23 16 C19.5 27, 19.5 40, 23 54" />
            <path d="M32 17 V55" />
            <path d="M41 16 C44.5 27, 44.5 40, 41 54" />
          </g>
          {/* Recessed wooden oval top lid */}
          <ellipse cx="32" cy="14" rx="15" ry="5" fill="#B5753D" stroke="#4A2710" strokeWidth="2" />
          <ellipse cx="32" cy="14" rx="11.5" ry="3.2" fill="#D4955A" stroke="#6B3C1B" strokeWidth="1.2" />
          <circle cx="36" cy="14" r="1.6" fill="#593216" />
          {/* Upper & lower riveted dark-iron hoops */}
          <path
            d="M13.5 24 C21 28, 43 28, 50.5 24 L51 28.5 C43 32.5, 21 32.5, 13 28.5 Z"
            fill="#484F5E"
            stroke="#22262E"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M13 41 C21 45, 43 45, 51 41 L50.2 45.5 C43 49.5, 21 49.5, 13.8 45.5 Z"
            fill="#484F5E"
            stroke="#22262E"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          {/* Iron rivets & subtle metallic glint */}
          <g fill="#B6C0D1">
            <circle cx="21" cy="28" r="1.2" />
            <circle cx="32" cy="29.4" r="1.2" />
            <circle cx="43" cy="28" r="1.2" />
            <circle cx="21" cy="45" r="1.2" />
            <circle cx="32" cy="46.4" r="1.2" />
            <circle cx="43" cy="45" r="1.2" />
          </g>
        </svg>
      );

    case 'anchor':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('brass')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5CF6B" />
              <stop offset="55%" stopColor="#D19D32" />
              <stop offset="100%" stopColor="#9E6E16" />
            </linearGradient>
          </defs>
          {/* Soft shadow */}
          <ellipse cx="32" cy="56.5" rx="18" ry="3.2" fill="#1F1914" opacity="0.16" />
          {/* Twisted nautical rope loop */}
          <path
            d="M27 11 C19 9, 14 14, 17 20 C19 23, 24 23, 26 20"
            fill="none"
            stroke="#7A5A32"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M27 11 C19 9, 14 14, 17 20 C19 23, 24 23, 26 20"
            fill="none"
            stroke="#E3C388"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="3 2.5"
          />
          {/* Bold sweeping curved anchor arms */}
          <path
            d="M13 38 C14.5 53, 26 55.5, 32 55.5 C38 55.5, 49.5 53, 51 38"
            fill="none"
            stroke="#593A0A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M13 38 C14.5 53, 26 55.5, 32 55.5 C38 55.5, 49.5 53, 51 38"
            fill="none"
            stroke={`url(#${g('brass')})`}
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          {/* Sharp triangular anchor flukes */}
          <polygon points="8,41 12.5,31 19,38.5" fill={`url(#${g('brass')})`} stroke="#593A0A" strokeWidth="1.9" strokeLinejoin="round" />
          <polygon points="56,41 51.5,31 45,38.5" fill={`url(#${g('brass')})`} stroke="#593A0A" strokeWidth="1.9" strokeLinejoin="round" />
          {/* Central vertical shank */}
          <path d="M29.2 18 H34.8 L36 53.5 L32 57 L28 53.5 Z" fill={`url(#${g('brass')})`} stroke="#593A0A" strokeWidth="2" strokeLinejoin="round" />
          {/* Horizontal crossbar stock with ball ends */}
          <rect x="19" y="21.5" width="26" height="4.6" rx="2.3" fill={`url(#${g('brass')})`} stroke="#593A0A" strokeWidth="1.8" />
          <circle cx="19" cy="23.8" r="3" fill="#EFC55B" stroke="#593A0A" strokeWidth="1.6" />
          <circle cx="45" cy="23.8" r="3" fill="#EFC55B" stroke="#593A0A" strokeWidth="1.6" />
          {/* Top brass shackle ring */}
          <circle cx="32" cy="13" r="5.5" fill="none" stroke="#593A0A" strokeWidth="4.6" />
          <circle cx="32" cy="13" r="5.5" fill="none" stroke="#F2CA63" strokeWidth="2.4" />
        </svg>
      );

    case 'luggage':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id={g('leather')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B86B40" />
              <stop offset="100%" stopColor="#854524" />
            </linearGradient>
          </defs>
          {/* Contact shadow */}
          <ellipse cx="32" cy="54.5" rx="25" ry="3.6" fill="#1F1914" opacity="0.18" />
          {/* Sturdy leather top carry handle */}
          <path
            d="M24 19 V13.5 C24 11, 26 10, 29 10 H35 C38 10, 40 11, 40 13.5 V19"
            fill="none"
            stroke="#472310"
            strokeWidth="4.6"
            strokeLinecap="round"
          />
          <path
            d="M24 19 V13.5 C24 11, 26 10, 29 10 H35 C38 10, 40 11, 40 13.5 V19"
            fill="none"
            stroke="#9E5630"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Vintage leather steamer trunk body */}
          <rect x="8.5" y="18" width="47" height="34" rx="5" fill={`url(#${g('leather')})`} stroke="#45210E" strokeWidth="2.1" />
          {/* Lid seam line */}
          <line x1="9" y1="27" x2="55" y2="27" stroke="#4F2611" strokeWidth="1.5" />
          {/* Vintage colorful travel stickers */}
          <ellipse cx="32" cy="37" rx="5.5" ry="4" transform="rotate(-10 32 37)" fill="#D94A3F" stroke="#FFF4D9" strokeWidth="1.2" />
          <polygon points="32,34.8 33.8,37 32,39.2 30.2,37" fill="#FFF4D9" />
          <rect x="12" y="34" width="6.5" height="5" rx="1" transform="rotate(8 15 36.5)" fill="#3F8FA8" stroke="#FFF4D9" strokeWidth="1" />
          {/* Brass L-shaped corner protectors */}
          <path d="M8.5 24 V21 C8.5 19, 10 18, 12.5 18 H15.5 V21.5 H12 V24 Z" fill="#E8BE54" stroke="#5E400C" strokeWidth="1.2" />
          <path d="M55.5 24 V21 C55.5 19, 54 18, 51.5 18 H48.5 V21.5 H52 V24 Z" fill="#E8BE54" stroke="#5E400C" strokeWidth="1.2" />
          <path d="M8.5 46 V49 C8.5 51, 10 52, 12.5 52 H15.5 V48.5 H12 V46 Z" fill="#E8BE54" stroke="#5E400C" strokeWidth="1.2" />
          <path d="M55.5 46 V49 C55.5 51, 54 52, 51.5 52 H48.5 V48.5 H52 V46 Z" fill="#E8BE54" stroke="#5E400C" strokeWidth="1.2" />
          {/* Two vertical buckled tan leather straps */}
          <rect x="19" y="18" width="5" height="34" fill="#DCA75E" stroke="#5E3A14" strokeWidth="1.4" />
          <rect x="40" y="18" width="5" height="34" fill="#DCA75E" stroke="#5E3A14" strokeWidth="1.4" />
          {/* Brass buckles & center clasp */}
          <rect x="18" y="24.5" width="7" height="5" rx="1" fill="#F0C75E" stroke="#5E400C" strokeWidth="1.3" />
          <rect x="39" y="24.5" width="7" height="5" rx="1" fill="#F0C75E" stroke="#5E400C" strokeWidth="1.3" />
          <rect x="29.5" y="24.5" width="5" height="5" rx="1" fill="#F0C75E" stroke="#5E400C" strokeWidth="1.2" />
        </svg>
      );
  }
});
