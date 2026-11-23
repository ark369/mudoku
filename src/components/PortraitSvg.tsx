import React from 'react';
import type { Person } from '../engine/types';

interface PortraitSvgProps {
  person: Person;
  size?: number;
}

const SKIN_TONES = ['#F5D3B8', '#E6B792', '#CE9467', '#8B593D', '#FAE0C8', '#BC7E52'];
const HAIR_COLORS = ['#2F211B', '#743D26', '#C68A39', '#202330', '#8C392A', '#646A78'];

export const PortraitSvg: React.FC<PortraitSvgProps> = React.memo(({ person, size = 48 }) => {
  const pid = person.portraitId;
  const skin = SKIN_TONES[pid % SKIN_TONES.length];
  const hair = HAIR_COLORS[(pid * 3 + 1) % HAIR_COLORS.length];
  const hairVariant = pid % 4;
  const outfitVariant = (pid + (person.isVictim ? 2 : 0)) % 5;

  const hasRoundGlasses = pid % 4 === 1;
  const hasHalfGlasses = !hasRoundGlasses && pid % 6 === 2;
  const hasHat = person.isVictim || pid % 5 === 0 || pid % 7 === 3;
  const isBeret = !person.isVictim && pid % 5 === 0;
  const hasMustache = !person.isVictim && person.gender === 'M' && pid % 3 === 0;
  const hasEarrings = person.gender === 'F' && pid % 2 === 1;

  const ink = '#1E2028';
  const paperTint = person.isVictim ? '#F5E5B8' : '#F3ECE0';
  const frameBorder = person.isVictim ? '#9E6F21' : '#2E2B26';

  return (
    <div
      className="portrait-plate-wrap"
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        style={{
          borderRadius: '5px',
          background: paperTint,
          border: `1.5px solid ${frameBorder}`,
          boxShadow: 'inset 0 0 0 1px rgba(255,253,248,0.65), 0 1px 2px rgba(25,26,31,0.1)',
          display: 'block',
        }}
        aria-hidden="true"
      >
        {/* Subtle bookplate background cross-hatching */}
        <g stroke="rgba(30, 32, 40, 0.08)" strokeWidth="0.9">
          <line x1="4" y1="9" x2="11" y2="2" />
          <line x1="4" y1="14" x2="16" y2="2" />
          <line x1="53" y1="2" x2="60" y2="9" />
          <line x1="48" y1="2" x2="60" y2="14" />
        </g>

        {/* Fine inner bookplate rule */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="3"
          fill="none"
          stroke={person.isVictim ? 'rgba(180, 50, 37, 0.32)' : 'rgba(30, 32, 40, 0.16)'}
          strokeWidth="0.8"
        />

        {/* Victim subtle gold corner diamond */}
        {person.isVictim && (
          <polygon points="9,6 11.5,9 9,12 6.5,9" fill="#B43225" opacity="0.82" />
        )}

        {/* Back Hair Layer */}
        {person.gender === 'F' && hairVariant === 0 && (
          <path
            d="M16 31 C15 14, 49 14, 48 31 L50 47 Q43 45 39 48 L25 48 Q21 45 14 47 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        )}
        {person.gender === 'F' && hairVariant === 1 && (
          <g>
            <circle cx="32" cy="11" r="7" fill={hair} stroke={ink} strokeWidth="1.4" />
            <path
              d="M17 31 C17 15, 47 15, 47 31 L47 41 L17 41 Z"
              fill={hair}
              stroke={ink}
              strokeWidth="1.3"
            />
          </g>
        )}
        {person.gender === 'F' && hairVariant === 2 && (
          <path
            d="M16 30 C14 14, 50 14, 48 30 C52 38, 52 46, 48 51 L16 51 C12 46, 12 38, 16 30 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.4"
          />
        )}
        {person.gender === 'F' && hairVariant === 3 && (
          <path
            d="M17 31 C16 15, 48 15, 47 31 L49 44 Q41 42 36 45 L28 45 Q23 42 15 44 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.4"
          />
        )}

        {/* Shoulders & Coat Base */}
        <path
          d="M10 64 C11 46, 22 44, 32 44 C42 44, 53 46, 54 64 Z"
          fill={person.color}
          stroke={ink}
          strokeWidth="1.5"
        />

        {/* Outfit Details */}
        {outfitVariant === 0 && (
          <g>
            <polygon points="24,45 32,56 40,45" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
            <polygon points="27,48 32,51 27,54" fill={ink} />
            <polygon points="37,48 32,51 37,54" fill={ink} />
            <circle cx="32" cy="51" r="1.8" fill={ink} />
          </g>
        )}
        {outfitVariant === 1 && (
          <g>
            <path
              d="M24 44 Q32 49 40 44 L41 50 Q32 54 23 50 Z"
              fill={person.color}
              stroke={ink}
              strokeWidth="1.3"
            />
            <line x1="27" y1="46" x2="27" y2="50" stroke={ink} strokeWidth="1" opacity="0.55" />
            <line x1="32" y1="47" x2="32" y2="51" stroke={ink} strokeWidth="1" opacity="0.55" />
            <line x1="37" y1="46" x2="37" y2="50" stroke={ink} strokeWidth="1" opacity="0.55" />
          </g>
        )}
        {outfitVariant === 2 && (
          <g>
            <path
              d="M21 45 Q32 52 43 45 L45 53 Q32 59 19 53 Z"
              fill="#EFE7D6"
              stroke={ink}
              strokeWidth="1.3"
            />
            <path
              d="M28 53 L26 62 L33 62 L34 54 Z"
              fill="#E3D7BF"
              stroke={ink}
              strokeWidth="1.2"
            />
          </g>
        )}
        {outfitVariant === 3 && (
          <g>
            <polygon points="25,45 32,57 39,45" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
            <polygon points="30.5,48 33.5,48 34,58 32,60 30,58" fill="#B43225" stroke={ink} strokeWidth="1" />
            <path d="M22 46 L27 55 L23 57" fill="none" stroke={ink} strokeWidth="1.3" />
            <path d="M42 46 L37 55 L41 57" fill="none" stroke={ink} strokeWidth="1.3" />
          </g>
        )}
        {outfitVariant === 4 && (
          <g>
            <path d="M23 45 Q32 50 41 45 L39 58 L25 58 Z" fill="#F8F3E8" stroke={ink} strokeWidth="1.2" />
            <line x1="32" y1="49" x2="32" y2="58" stroke={ink} strokeWidth="1.1" />
          </g>
        )}

        {/* Neck */}
        <path
          d="M27.5 40 L27.5 46.5 Q32 49 36.5 46.5 L36.5 40 Z"
          fill={skin}
          stroke={ink}
          strokeWidth="1.2"
        />

        {/* Ears */}
        <circle cx="18.2" cy="31.5" r="2.7" fill={skin} stroke={ink} strokeWidth="1.2" />
        <circle cx="45.8" cy="31.5" r="2.7" fill={skin} stroke={ink} strokeWidth="1.2" />
        {hasEarrings && (
          <g fill="#FFFDF8" stroke={ink} strokeWidth="0.9">
            <circle cx="18" cy="35" r="1.4" />
            <circle cx="46" cy="35" r="1.4" />
          </g>
        )}

        {/* Head Silhouette */}
        <path
          d="M19 29 C19 18, 45 18, 45 29 C45 39, 39 44, 32 44 C25 44, 19 39, 19 29 Z"
          fill={skin}
          stroke={ink}
          strokeWidth="1.5"
        />

        {/* Subtle Cheek Wash */}
        <ellipse cx="23.5" cy="34.5" rx="2.7" ry="1.4" fill="#D46B5E" opacity="0.22" />
        <ellipse cx="40.5" cy="34.5" rx="2.7" ry="1.4" fill="#D46B5E" opacity="0.22" />

        {/* Front Hair Crown */}
        {person.gender === 'M' && hairVariant === 0 && (
          <path
            d="M18.5 29 C18 16, 45.5 15, 45.5 29 C42 22, 34 23, 27 21 C23 23, 20 25, 18.5 29 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.3"
          />
        )}
        {person.gender === 'M' && hairVariant === 1 && (
          <path
            d="M18 28 C17 20, 22 16, 26 17 C29 14, 35 14, 38 17 C43 16, 47 20, 46 28 C41 23, 23 23, 18 28 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.3"
          />
        )}
        {person.gender === 'M' && hairVariant === 2 && (
          <path
            d="M18.5 29 C18 15, 42 13, 45.5 25 C45.5 27, 45.5 29, 45 29 C40 22, 26 21, 18.5 29 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.3"
          />
        )}
        {person.gender === 'M' && hairVariant === 3 && (
          <g>
            <path
              d="M19 28 C19 16, 45 16, 45 28 C40 21.5, 24 21.5, 19 28 Z"
              fill={hair}
              stroke={ink}
              strokeWidth="1.3"
            />
            <path d="M19.2 26.5 L21.5 28" stroke="#E8E3D9" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M44.8 26.5 L42.5 28" stroke="#E8E3D9" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}
        {person.gender === 'F' && (
          <path
            d="M19 27 C20 16, 44 16, 45 27 C39 22, 34 22, 32 24 C29 21.5, 23 22, 19 27 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="1.2"
          />
        )}

        {/* Eyebrows */}
        <path
          d="M23.5 27.5 Q26.5 26 29.2 27.2"
          fill="none"
          stroke={hair}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M34.8 27.2 Q37.5 26 40.5 27.5"
          fill="none"
          stroke={hair}
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* Eyes with specular highlight */}
        <circle cx="26.5" cy="30.8" r="1.9" fill={ink} />
        <circle cx="37.5" cy="30.8" r="1.9" fill={ink} />
        <circle cx="27.1" cy="30.2" r="0.6" fill="#FFFDF8" />
        <circle cx="38.1" cy="30.2" r="0.6" fill="#FFFDF8" />

        {/* Subtle Nose */}
        <path
          d="M32 29.5 L30.8 34.2 Q32 35.1 33.4 34.3"
          fill="none"
          stroke="rgba(120, 68, 48, 0.7)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Mustache */}
        {hasMustache && (
          <path
            d="M26 37.5 Q29 35.2 32 36.8 Q35 35.2 38 37.5 Q35 39 32 37.7 Q29 39 26 37.5 Z"
            fill={hair}
            stroke={ink}
            strokeWidth="0.8"
          />
        )}

        {/* Mouth */}
        <path
          d={pid % 2 === 0 ? 'M27.8 38.6 Q32 41.6 36.2 38.6' : 'M28.2 38.9 Q32.5 41 36 37.9'}
          fill="none"
          stroke="#7A3E32"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Eyewear */}
        {hasRoundGlasses && (
          <g fill="none" stroke={ink} strokeWidth="1.35">
            <circle cx="26.5" cy="31" r="4.3" />
            <circle cx="37.5" cy="31" r="4.3" />
            <line x1="30.8" y1="31" x2="33.2" y2="31" />
          </g>
        )}
        {hasHalfGlasses && (
          <g fill="none" stroke="#4D3D2C" strokeWidth="1.3">
            <path d="M22.5 31.2 L30.3 31.2 A3.8 3.4 0 0 1 22.5 31.2 Z" />
            <path d="M33.7 31.2 L41.5 31.2 A3.8 3.4 0 0 1 33.7 31.2 Z" />
            <line x1="30.3" y1="31.2" x2="33.7" y2="31.2" />
          </g>
        )}

        {/* Hats & Berets */}
        {hasHat && isBeret && person.gender === 'F' && (
          <g>
            <path
              d="M17 20 C16 12, 34 8, 45 14 C48 16, 46 21, 39 21 C29 20, 21 21, 17 20 Z"
              fill={person.color}
              stroke={ink}
              strokeWidth="1.4"
            />
            <line x1="33" y1="10" x2="34" y2="7.5" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
        {hasHat && isBeret && person.gender === 'M' && (
          <g>
            <path
              d="M17 21 C18 12, 43 12, 46 19 C43 21, 23 20, 17 21 Z"
              fill="#5D5143"
              stroke={ink}
              strokeWidth="1.4"
            />
            <path d="M18 20.5 L45 20.5 L47 22.5 Q32 23 18 20.5 Z" fill="#3B332A" stroke={ink} strokeWidth="1.1" />
          </g>
        )}
        {hasHat && !isBeret && (
          <g>
            <path
              d="M21 19 C22 10.5, 42 10.5, 43 19 Z"
              fill={person.isVictim ? '#B8893A' : '#3C404E'}
              stroke={ink}
              strokeWidth="1.4"
            />
            <path
              d="M21 17 L43 17 L43 19 L21 19 Z"
              fill={person.isVictim ? '#8D281E' : '#8F7B58'}
            />
            <ellipse
              cx="32"
              cy="19"
              rx="17"
              ry="3.4"
              fill={person.isVictim ? '#9F7429' : '#2D303B'}
              stroke={ink}
              strokeWidth="1.3"
            />
          </g>
        )}
      </svg>

      {/* Engraved Enamel Monogram Corner Seal */}
      <span
        className="portrait-corner-seal"
        style={{
          background: person.color,
          borderColor: person.isVictim ? '#D4AF5A' : '#FFFDF8',
        }}
      >
        {person.letter}
      </span>
    </div>
  );
});
