import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { OBJECT_INFO } from '../engine/themes';
import type { ObjectKind, Puzzle } from '../engine/types';
import { FurnitureSvg } from './FurnitureSvg';

interface MapKeyPopoverProps {
  puzzle: Puzzle;
  selectedKind: ObjectKind | null;
  onSelectKind: (kind: ObjectKind | null) => void;
  onClose: () => void;
}

export const MapKeyPopover: React.FC<MapKeyPopoverProps> = ({
  puzzle,
  selectedKind,
  onSelectKind,
  onClose,
}) => {
  const { occupiables, blockings } = useMemo(() => {
    const occSet = new Set<ObjectKind>();
    const blkSet = new Set<ObjectKind>();
    for (const row of puzzle.grid) {
      for (const cell of row) {
        if (cell.occupiable) occSet.add(cell.occupiable);
        if (cell.blocking) blkSet.add(cell.blocking);
      }
    }
    return {
      occupiables: Array.from(occSet),
      blockings: Array.from(blkSet),
    };
  }, [puzzle.grid]);

  return (
    <div className="map-key-popover" role="dialog" aria-label="Floor Plan Map Key">
      <div className="map-key-header">
        <span>Floor Plan Key — tap to highlight</span>
        <button
          type="button"
          className="map-key-close"
          onClick={onClose}
          aria-label="Close Map Key"
        >
          <X size={15} />
        </button>
      </div>

      {occupiables.length > 0 && (
        <div className="map-key-section">
          <div className="map-key-section-title">Walkable Furniture (Stand On)</div>
          <div className="map-key-chips">
            {occupiables.map((kind) => {
              const info = OBJECT_INFO[kind];
              const active = selectedKind === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  className={`map-key-chip ${active ? 'active' : ''}`}
                  onClick={() => onSelectKind(active ? null : kind)}
                >
                  <span className="map-key-icon">
                    <FurnitureSvg kind={kind} />
                  </span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {blockings.length > 0 && (
        <div className="map-key-section">
          <div className="map-key-section-title">Solid Obstacles (Stand Beside)</div>
          <div className="map-key-chips">
            {blockings.map((kind) => {
              const info = OBJECT_INFO[kind];
              const active = selectedKind === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  className={`map-key-chip blocking ${active ? 'active' : ''}`}
                  onClick={() => onSelectKind(active ? null : kind)}
                >
                  <span className="map-key-icon">
                    <FurnitureSvg kind={kind} />
                  </span>
                  <span>{info.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="map-key-section map-key-guide">
        <div className="map-key-section-title">Board Guide</div>
        <div className="map-key-guide-list">
          <div className="map-key-guide-item">
            <span className="guide-swatch swatch-hatch" aria-hidden="true" />
            <span>Hatched = Obstacle</span>
          </div>
          <div className="map-key-guide-item">
            <span className="guide-swatch swatch-guide" aria-hidden="true" />
            <span>Slate line = Row / col taken</span>
          </div>
          <div className="map-key-guide-item">
            <span className="guide-swatch swatch-bracket" aria-hidden="true" />
            <span>Corner marks = Clue focus</span>
          </div>
        </div>
      </div>
    </div>
  );
};
