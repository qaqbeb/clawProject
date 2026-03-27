import React, { useEffect, useRef } from 'react';
import { STAT_NAMES_ZH, STAT_ORDER } from '../data/constants';

// 种族值雷达图组件
function StatsRadarChart({ stats, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !stats || stats.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;
    const maxStat = 200;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 按 STAT_ORDER 顺序排列 stats
    const statMap = {};
    stats.forEach(s => {
      statMap[s.stat.name] = s.base_stat;
    });
    const orderedStats = STAT_ORDER.map(name => ({
      name,
      value: statMap[name] || 0,
      label: STAT_NAMES_ZH[name] || name,
    }));

    // 计算六边形顶点坐标
    function getHexagonPoints(cx, cy, radius) {
      const points = [];
      for (let i = 0; i < 6; i++) {
        // 从顶部开始，顺时针方向
        const angle = (Math.PI / 2) * 3 + (Math.PI / 3) * i;
        points.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      }
      return points;
    }

    // 绘制六边形网格背景
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    gridLevels.forEach(level => {
      const radius = maxRadius * level;
      const points = getHexagonPoints(centerX, centerY, radius);

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === 1.0 ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = level === 1.0 ? 1.5 : 0.5;
      ctx.stroke();
    });

    // 绘制从中心到顶点的线
    const outerPoints = getHexagonPoints(centerX, centerY, maxRadius);
    outerPoints.forEach(point => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 绘制数据区域
    const dataPoints = orderedStats.map((stat, i) => {
      const value = Math.min(stat.value, maxStat);
      const radius = (value / maxStat) * maxRadius;
      const angle = (Math.PI / 2) * 3 + (Math.PI / 3) * i;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        value: stat.value,
        label: stat.label,
      };
    });

    // 填充区域
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);
    for (let i = 1; i < dataPoints.length; i++) {
      ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
    }
    ctx.closePath();

    // 半透明填充
    ctx.fillStyle = color ? `${color}40` : 'rgba(99, 102, 241, 0.3)';
    ctx.fill();
    ctx.strokeStyle = color || '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制顶点圆点和数值
    dataPoints.forEach((point, i) => {
      // 顶点圆点
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color || '#6366f1';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 数值标签
      ctx.font = 'bold 11px -apple-system, sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 根据位置调整数值偏移
      const outerPoint = outerPoints[i];
      const offsetX = (outerPoint.x - centerX) * 0.15;
      const offsetY = (outerPoint.y - centerY) * 0.15;
      ctx.fillText(point.value.toString(), point.x + offsetX, point.y + offsetY - 8);
    });

    // 绘制属性名标签
    ctx.font = 'bold 12px -apple-system, sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    orderedStats.forEach((stat, i) => {
      const outerPoint = outerPoints[i];
      const labelOffsetX = (outerPoint.x - centerX) * 0.25;
      const labelOffsetY = (outerPoint.y - centerY) * 0.25;
      ctx.fillText(stat.label, centerX + labelOffsetX * 2, centerY + labelOffsetY * 2);
    });

  }, [stats, color]);

  return (
    <canvas
      ref={canvasRef}
      width={250}
      height={250}
      style={{ display: 'block' }}
    />
  );
}

export default StatsRadarChart;