import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, TYPE_COLORS, TYPE_NAMES_ZH, POKEMON_NAMES_ZH, STAT_NAMES_ZH, STAT_ORDER } from '../data/constants';
import { styles } from '../styles/index';
import StatsRadarChart from './StatsRadarChart';
import CompareView from './CompareView';

// 获取进化链数据
async function fetchEvolutionChain(pokemonId) {
  try {
    // 1. 获取 pokemon-species 数据，找到进化链 URL
    const speciesRes = await axios.get(`${BASE_URL}/pokemon-species/${pokemonId}`);
    const evolutionChainUrl = speciesRes.data.evolution_chain.url;

    // 2. 获取进化链数据
    const chainRes = await axios.get(evolutionChainUrl);
    const chainData = chainRes.data.chain;

    // 3. 递归解析进化链
    const chain = [];

    function parseChainNode(node) {
      if (!node) return;

      // 从 URL 中提取 pokemon id
      const urlParts = node.species.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2], 10);

      chain.push({
        name: node.species.name,
        id: id,
      });

      // 递归处理进化分支（通常只有一个，但有些有多分支进化）
      if (node.evolves_to && node.evolves_to.length > 0) {
        // 对于多分支进化，我们按顺序处理
        // 注意：这里简化处理，只取第一个分支作为主进化链
        // 如果需要完整的分支进化，需要调整数据结构
        node.evolves_to.forEach(evolution => {
          parseChainNode(evolution);
        });
      }
    }

    parseChainNode(chainData);

    return { chain };
  } catch (error) {
    console.error('获取进化链失败:', error);
    return { chain: [] };
  }
}

// 详情视图组件
function DetailView({ pokemon, onBack, loading, onSelect, compareList = [], onAddToCompare, onRemoveFromCompare, showCompare, onShowCompare }) {
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loadingEvolution, setLoadingEvolution] = useState(false);

  // 检查当前宝可梦是否已在对比列表中
  const isInCompareList = compareList.some(p => p.id === pokemon.id);
  // 对比列表是否已满
  const isCompareListFull = compareList.length >= 2;

  // 获取进化链
  useEffect(() => {
    if (!pokemon) return;

    async function loadEvolutionChain() {
      setLoadingEvolution(true);
      const result = await fetchEvolutionChain(pokemon.id);
      setEvolutionChain(result);
      setLoadingEvolution(false);
    }

    loadEvolutionChain();
  }, [pokemon?.id]);

  // 点击进化链中的宝可梦
  const handleEvolutionClick = (evo) => {
    if (evo.id !== pokemon.id && onSelect) {
      onSelect(evo);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  const types = pokemon.types.map(t => t.type.name);
  const mainType = types[0];

  // 过滤掉当前宝可梦，避免显示自己
  const filteredChain = evolutionChain?.chain?.filter(evo => evo.id !== pokemon.id);

  return (
    <div style={{ ...styles.container, backgroundColor: TYPE_COLORS[mainType] + '20' }}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <button onClick={onBack} style={styles.backButton}>← 返回</button>
          
          {/* 加入对比按钮 */}
          <button
            onClick={() => {
              if (isInCompareList) {
                onRemoveFromCompare && onRemoveFromCompare(pokemon.id);
              } else {
                onAddToCompare && onAddToCompare(pokemon);
              }
            }}
            disabled={!isInCompareList && isCompareListFull}
            style={{
              ...styles.compareButton,
              backgroundColor: isInCompareList ? '#ef4444' : (isCompareListFull ? '#9ca3af' : '#10b981'),
              cursor: isCompareListFull && !isInCompareList ? 'not-allowed' : 'pointer',
            }}
          >
            {isInCompareList ? '移出对比' : '加入对比'} ({compareList.length}/2)
          </button>
          
          {/* 查看对比按钮 - 当对比列表有2只时显示 */}
          {compareList.length === 2 && (
            <button
              onClick={() => onShowCompare && onShowCompare(true)}
              style={styles.viewCompareButton}
            >
              ⚖️ 查看对比
            </button>
          )}
        </div>
        <h1 style={styles.title}>#{String(pokemon.id).padStart(3, '0')} {pokemon.name.toUpperCase()}</h1>
      </header>

      <div style={styles.detailContent}>
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          style={styles.detailImage}
        />
        <div style={styles.detailInfo}>
          <div style={styles.typeBadges}>
            {types.map((type, idx) => (
              <span key={idx} style={{ ...styles.typeBadge, backgroundColor: TYPE_COLORS[type] }}>
                {TYPE_NAMES_ZH[type]}
              </span>
            ))}
          </div>
          <div style={styles.infoRow}>
            <span>身高: {(pokemon.height / 10).toFixed(1)}m</span>
            <span>体重: {(pokemon.weight / 10).toFixed(1)}kg</span>
          </div>
          {/* 特性展示 */}
          <div style={styles.abilitiesSection}>
            <h4 style={styles.abilitiesTitle}>特性：</h4>
            <div style={styles.abilitiesList}>
              {pokemon.abilities?.map((abilityInfo, idx) => {
                const abilityName = abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1);
                const isHidden = abilityInfo.is_hidden;
                return (
                  <span
                    key={idx}
                    style={{
                      ...styles.abilityBadge,
                      backgroundColor: isHidden ? '#9ca3af' : '#6366f1',
                    }}
                  >
                    {abilityName}
                    {isHidden && <span style={styles.hiddenTag}> (隐藏)</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 种族值雷达图 */}
          <div style={styles.statsSection}>
            <h4 style={styles.statsTitle}>种族值：</h4>
            <div style={styles.radarChartContainer}>
              <StatsRadarChart stats={pokemon.stats} color={TYPE_COLORS[mainType]} />
            </div>
            {/* 数值列表 */}
            <div style={styles.statsList}>
              {pokemon.stats?.map((statInfo, idx) => {
                const statName = STAT_NAMES_ZH[statInfo.stat.name] || statInfo.stat.name;
                const percentage = Math.min((statInfo.base_stat / 200) * 100, 100);
                return (
                  <div key={idx} style={styles.statRow}>
                    <span style={styles.statName}>{statName}</span>
                    <div style={styles.statBarBg}>
                      <div 
                        style={{
                          ...styles.statBar,
                          width: `${percentage}%`,
                          backgroundColor: TYPE_COLORS[mainType] || '#6366f1',
                        }}
                      />
                    </div>
                    <span style={styles.statValue}>{statInfo.base_stat}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 进化链展示 */}
      {loadingEvolution && (
        <div style={styles.evolutionSection}>
          <p style={styles.evolutionLoading}>加载进化链...</p>
        </div>
      )}

      {!loadingEvolution && evolutionChain?.chain?.length > 1 && (
        <div style={styles.evolutionSection}>
          <h3 style={styles.evolutionTitle}>进化链：</h3>
          <div style={styles.evolutionChain}>
            {evolutionChain.chain.map((evo, idx) => (
              <React.Fragment key={evo.id}>
                <div
                  style={{
                    ...styles.evolutionItem,
                    cursor: evo.id !== pokemon.id ? 'pointer' : 'default',
                    opacity: evo.id === pokemon.id ? 1 : 0.7,
                    transform: evo.id === pokemon.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onClick={() => evo.id !== pokemon.id && handleEvolutionClick(evo)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                    alt={evo.name}
                    style={styles.evolutionImage}
                  />
                  <p style={styles.evolutionName}>
                    {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
                  </p>
                  <p style={styles.evolutionId}>#{String(evo.id).padStart(3, '0')}</p>
                </div>
                {idx < evolutionChain.chain.length - 1 && (
                  <span style={styles.evolutionArrow}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {/* 对比弹窗 */}
      {showCompare && compareList && compareList.length === 2 && (
        <CompareView
          compareList={compareList}
          onClose={() => onShowCompare(false)}
        />
      )}
    </div>
  );
}

export default DetailView;