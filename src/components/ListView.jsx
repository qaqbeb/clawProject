import React from 'react';
import { TYPE_COLORS, TYPE_NAMES_ZH, POKEMON_NAMES_ZH, TYPES, GENERATIONS } from '../data/constants';
import { styles } from '../styles/index';

// 心形图标组件
function HeartIcon({ filled, onClick, size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#ff4757' : 'none'}
      stroke="#ff4757"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, fill 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// 列表视图组件
function ListView({ pokemonList, searchQuery, selectedType, selectedGen, onSearch, onTypeChange, onGenChange, onSelect, favorites, onToggleFavorite, showFavoritesOnly, onFavoritesToggle, totalCount, currentPage, totalPages, onPageChange, showTypeChart, onShowTypeChart, attackType, onAttackTypeChange, compareList, onShowCompare }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🐾 宝可梦图鉴</h1>
        <p style={styles.subtitle}>全世代 1000+ 只宝可梦</p>
      </header>

      <div style={styles.filterContainer}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="搜索宝可梦（名称或编号）..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} style={styles.clearButton}>✕</button>
          )}
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>世代：</label>
            <select value={selectedGen} onChange={(e) => onGenChange(e.target.value)} style={styles.filterSelect}>
              {GENERATIONS.map((g) => (
                <option key={g.gen} value={g.gen}>{g.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>属性：</label>
            <select value={selectedType} onChange={(e) => onTypeChange(e.target.value)} style={styles.filterSelect}>
              {TYPES.map((type) => (
                <option key={type} value={type}>{TYPE_NAMES_ZH[type]}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterItem}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => onFavoritesToggle(e.target.checked)}
              />
              ❤️ 只看收藏 ({favorites.size})
            </label>
          </div>

          <button 
            onClick={() => onShowTypeChart(true)} 
            style={styles.typeChartButton}
          >
            🎯 属性相克表
          </button>

          {compareList && compareList.length === 2 && (
            <button 
              onClick={() => onShowCompare(true)} 
              style={styles.viewCompareButton}
            >
              ⚖️ 查看对比 ({compareList.length}/2)
            </button>
          )}
        </div>

        <div style={styles.resultCount}>
          显示 {totalCount} 只宝可梦
          {selectedGen > 0 && ` · ${GENERATIONS.find(g => g.gen === selectedGen)?.name}`}
          {selectedType !== 'all' && ` · ${TYPE_NAMES_ZH[selectedType]}属性`}
          {showFavoritesOnly && ' · 仅收藏'}
        </div>
      </div>

      <div style={styles.grid}>
        {pokemonList.map((p) => (
          <div key={p.id} style={styles.card} onClick={() => onSelect(p)}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(p.id); }}
              style={styles.favoriteButton}
            >
              <HeartIcon filled={favorites.has(p.id)} size={20} />
            </button>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
              alt={p.name}
              style={styles.cardImage}
            />
            <p style={styles.cardId}>#{String(p.id).padStart(3, '0')}</p>
            {POKEMON_NAMES_ZH[p.name] && <p style={styles.cardNameZh}>{POKEMON_NAMES_ZH[p.name]}</p>}
            <p style={styles.cardNameEn}>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</p>
            <div style={styles.cardTypes}>
              {p.types.map((type, idx) => (
                <span key={idx} style={{ ...styles.cardTypeBadge, backgroundColor: TYPE_COLORS[type] || '#999' }}>
                  {TYPE_NAMES_ZH[type] || type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pokemonList.length === 0 && (
        <div style={styles.noResults}>
          <p>😕 没有找到符合条件的宝可梦</p>
        </div>
      )}

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={styles.pageButton}>
            ← 上一页
          </button>
          <span style={styles.pageInfo}>第 {currentPage} / {totalPages} 页</span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={styles.pageButton}>
            下一页 →
          </button>
        </div>
      )}
    </div>
  );
}

export default ListView;