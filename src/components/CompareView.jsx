import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, TYPE_COLORS, TYPE_NAMES_ZH, STAT_NAMES_ZH, STAT_ORDER } from '../data/constants';
import { styles, compareStyles } from '../styles/index';

// 对比视图组件
function CompareView({ compareList, onClose }) {
  const [pokemonDetails, setPokemonDetails] = useState([null, null]);
  const [loading, setLoading] = useState(true);

  // 获取两只宝可梦的详情
  useEffect(() => {
    async function fetchDetails() {
      if (compareList.length < 2) return;
      setLoading(true);
      try {
        const details = await Promise.all([
          axios.get(`${BASE_URL}/pokemon/${compareList[0].id}`),
          axios.get(`${BASE_URL}/pokemon/${compareList[1].id}`),
        ]);
        setPokemonDetails([details[0].data, details[1].data]);
      } catch (err) {
        console.error('获取对比详情失败:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [compareList]);

  if (loading || !pokemonDetails[0] || !pokemonDetails[1]) {
    return (
      <div style={compareStyles.overlay}>
        <div style={compareStyles.modal}>
          <div style={compareStyles.loading}>
            <div style={styles.spinner}></div>
            <p style={{ marginTop: 15, color: '#666' }}>加载对比数据...</p>
          </div>
        </div>
      </div>
    );
  }

  const pokemon1 = pokemonDetails[0];
  const pokemon2 = pokemonDetails[1];

  const types1 = pokemon1.types.map(t => t.type.name);
  const types2 = pokemon2.types.map(t => t.type.name);

  // 种族值对比
  const statMap1 = {};
  const statMap2 = {};
  pokemon1.stats.forEach(s => { statMap1[s.stat.name] = s.base_stat; });
  pokemon2.stats.forEach(s => { statMap2[s.stat.name] = s.base_stat; });

  return (
    <div style={compareStyles.overlay}>
      <div style={compareStyles.modal}>
        <h2 style={compareStyles.title}>⚔️ 宝可梦对比</h2>
        
        <div style={compareStyles.compareContainer}>
          {/* 左侧宝可梦 */}
          <div style={compareStyles.pokemonSide}>
            <img
              src={pokemon1.sprites.other['official-artwork'].front_default}
              alt={pokemon1.name}
              style={compareStyles.pokemonImage}
            />
            <h3 style={compareStyles.pokemonName}>
              #{String(pokemon1.id).padStart(3, '0')} {pokemon1.name.toUpperCase()}
            </h3>
            <div style={compareStyles.typeBadges}>
              {types1.map((type, idx) => (
                <span key={idx} style={{ ...compareStyles.typeBadge, backgroundColor: TYPE_COLORS[type] }}>
                  {TYPE_NAMES_ZH[type]}
                </span>
              ))}
            </div>
            <div style={compareStyles.infoRow}>
              <span>身高: {(pokemon1.height / 10).toFixed(1)}m</span>
              <span>体重: {(pokemon1.weight / 10).toFixed(1)}kg</span>
            </div>
          </div>

          {/* VS */}
          <div style={compareStyles.vsContainer}>
            <span style={compareStyles.vsText}>VS</span>
          </div>

          {/* 右侧宝可梦 */}
          <div style={compareStyles.pokemonSide}>
            <img
              src={pokemon2.sprites.other['official-artwork'].front_default}
              alt={pokemon2.name}
              style={compareStyles.pokemonImage}
            />
            <h3 style={compareStyles.pokemonName}>
              #{String(pokemon2.id).padStart(3, '0')} {pokemon2.name.toUpperCase()}
            </h3>
            <div style={compareStyles.typeBadges}>
              {types2.map((type, idx) => (
                <span key={idx} style={{ ...compareStyles.typeBadge, backgroundColor: TYPE_COLORS[type] }}>
                  {TYPE_NAMES_ZH[type]}
                </span>
              ))}
            </div>
            <div style={compareStyles.infoRow}>
              <span>身高: {(pokemon2.height / 10).toFixed(1)}m</span>
              <span>体重: {(pokemon2.weight / 10).toFixed(1)}kg</span>
            </div>
          </div>
        </div>

        {/* 种族值对比 */}
        <div style={compareStyles.statsSection}>
          <h4 style={compareStyles.statsTitle}>种族值对比</h4>
          {STAT_ORDER.map(statName => {
            const value1 = statMap1[statName] || 0;
            const value2 = statMap2[statName] || 0;
            const maxStat = 200;
            const percentage1 = (value1 / maxStat) * 100;
            const percentage2 = (value2 / maxStat) * 100;
            
            const isWin1 = value1 > value2;
            const isWin2 = value2 > value1;
            const isTie = value1 === value2;

            return (
              <div key={statName} style={compareStyles.statRow}>
                <div style={compareStyles.statLabel}>
                  <span style={compareStyles.statValueLeft(isWin1)}>{value1}</span>
                </div>
                <div style={compareStyles.statBarsContainer}>
                  <div style={compareStyles.statNameCenter}>{STAT_NAMES_ZH[statName]}</div>
                  <div style={compareStyles.statBarsRow}>
                    {/* 左侧进度条（反向） */}
                    <div style={compareStyles.statBarWrapper}>
                      <div 
                        style={{
                          ...compareStyles.statBarLeft,
                          width: `${percentage1}%`,
                          backgroundColor: isWin1 ? '#22c55e' : (isTie ? '#6b7280' : TYPE_COLORS[types1[0]]),
                        }}
                      />
                    </div>
                    {/* 右侧进度条 */}
                    <div style={compareStyles.statBarWrapper}>
                      <div 
                        style={{
                          ...compareStyles.statBarRight,
                          width: `${percentage2}%`,
                          backgroundColor: isWin2 ? '#22c55e' : (isTie ? '#6b7280' : TYPE_COLORS[types2[0]]),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div style={compareStyles.statLabel}>
                  <span style={compareStyles.statValueRight(isWin2)}>{value2}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 关闭按钮 */}
        <div style={compareStyles.footer}>
          <button onClick={onClose} style={compareStyles.closeButton}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompareView;