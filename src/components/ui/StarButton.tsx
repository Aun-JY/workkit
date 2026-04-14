import React, { useState } from 'react';
import { useFavorites } from '../../store/useFavorites';

interface StarButtonProps {
  toolId: string;
  size?: number;
  alwaysVisible?: boolean;
}

export const StarButton: React.FC<StarButtonProps> = ({
  toolId,
  size = 16,
  alwaysVisible = false,
}) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [bouncing, setBouncing] = useState(false);
  const starred = favorites.includes(toolId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBouncing(true);
    toggleFavorite(toolId);
    setTimeout(() => setBouncing(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      title={starred ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: alwaysVisible || starred ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        transform: bouncing ? 'scale(1.4)' : 'scale(1)',
        fontSize: size,
        lineHeight: 1,
        flexShrink: 0,
      }}
      className="star-btn"
    >
      {starred ? '⭐' : '☆'}
    </button>
  );
};
