import React from 'react';
import { TYPE_NAMES_ZH, TYPE_COLORS, TYPE_CHART } from '../data/constants';
import { modalStyles } from '../styles/index';

// 属性相克表弹窗组件
function TypeChartModal({ show, attackType, onAttackTypeChange, onClose }) {
  if (!show) return null;

  const defenseTypes = Object.keys(TYPE_NAMES_ZH).filter(t => t !== 'all');

  const getEffectiveness = (attack, defense) => {
    const chart = TYPE_CHART[attack];
    if (!chart) return 1;
    return chart[defense] !== undefined ? chart[defense] : 1;
  };

  const getEffectStyle = (effect) => {
    if (effect === 2) return { backgroundColor: '#4ade80', color: '#166534' }; // 绿色：2x
    if (effect === 0.5) return { backgroundColor: '#f87171', color: '#7f1d1d' }; // 红色：0.5x
    if (effect === 0) return { backgroundColor: '#9ca3af', color: '#374151' }; // 灰色：0x
    return { backgroundColor: '#ffffff', color: '#374151' }; // 白色：1x
  };

  const getEffectText = (effect) => {
    if (effect === 2) return '2x 有效';
    if (effect === 0.5) return '0.5x 减半';
    if (effect === 0) return '0x 无效';
    return '1x 正常';
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>🎯 属性相克表</h2>
          <button onClick={onClose} style={modalStyles.closeBtn}>✕</button>
        </div>
        <div style={modalStyles.content}>
          <div style={modalStyles.selectRow}>
            <label style={modalStyles.label}>攻击属性：</label>
            <select 
              value={attackType} 
              onChange={(e) => onAttackTypeChange(e.target.value)}
              style={modalStyles.select}
            >
              {defenseTypes.map(type => (
                <option key={type} value={type}>{TYPE_NAMES_ZH[type]}</option>
              ))}
            </select>
          </div>
          <div style={modalStyles.tableWrapper}>
            <table style={modalStyles.table}>
              <thead>
                <tr>
                  <th style={modalStyles.th}>防御属性</th>
                  <th style={modalStyles.th}>效果</th>
                </tr>
              </thead>
              <tbody>
                {defenseTypes.map(defense => {
                  const effect = getEffectiveness(attackType, defense);
                  return (
                    <tr key={defense}>
                      <td style={modalStyles.td}>
                        <span style={{
                          ...modalStyles.typeBadge,
                          backgroundColor: TYPE_COLORS[defense] || '#999'
                        }}>
                          {TYPE_NAMES_ZH[defense]}
                        </span>
                      </td>
                      <td style={{ ...modalStyles.td, ...modalStyles.effectCell }}>
                        <span style={{ ...modalStyles.effectBadge, ...getEffectStyle(effect) }}>
                          {getEffectText(effect)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypeChartModal;