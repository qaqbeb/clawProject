import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

// API 基础 URL
const BASE_URL = 'https://pokeapi.co/api/v2';

// 宝可梦中文名映射（第一世代 1-151）
const POKEMON_NAMES_ZH = {
  bulbasaur: '妙蛙种子',
  ivysaur: '妙蛙草',
  venusaur: '妙蛙花',
  charmander: '小火龙',
  charmeleon: '火恐龙',
  charizard: '喷火龙',
  squirtle: '杰尼龟',
  wartortle: '卡咪龟',
  blastoise: '水箭龟',
  caterpie: '绿毛虫',
  metapod: '铁甲蛹',
  butterfree: '巴大蝶',
  weedle: '独角虫',
  kakuna: '铁壳蛹',
  beedrill: '大针蜂',
  pidgey: '波波',
  pidgeotto: '比比鸟',
  pidgeot: '大比鸟',
  rattata: '小拉达',
  raticate: '拉达',
  spearow: '烈雀',
  fearow: '大嘴雀',
  ekans: '阿柏蛇',
  arbok: '阿柏怪',
  pikachu: '皮卡丘',
  raichu: '雷丘',
  sandshrew: '穿山鼠',
  sandslash: '穿山王',
  'nidoran-f': '尼多兰',
  nidorina: '尼多娜',
  nidoqueen: '尼多后',
  'nidoran-m': '尼多朗',
  nidorino: '尼多力诺',
  nidoking: '尼多王',
  clefairy: '皮皮',
  clefable: '皮可西',
  vulpix: '六尾',
  ninetales: '九尾',
  jigglypuff: '胖丁',
  wigglytuff: '胖可丁',
  zubat: '超音蝠',
  golbat: '大嘴蝠',
  oddish: '走路草',
  gloom: '臭臭花',
  vileplume: '霸王花',
  paras: '派拉斯',
  parasect: '派拉斯特',
  venonat: '毛球',
  venomoth: '摩鲁蛾',
  diglett: '地鼠',
  dugtrio: '三地鼠',
  meowth: '喵喵',
  persian: '猫老大',
  psyduck: '可达鸭',
  golduck: '哥达鸭',
  mankey: '猴怪',
  primeape: '火暴猴',
  growlithe: '卡蒂狗',
  arcanine: '风速狗',
  poliwag: '蚊香蝌蚪',
  poliwhirl: '蚊香君',
  poliwrath: '蚊香泳士',
  abra: '凯西',
  kadabra: '勇基拉',
  alakazam: '胡地',
  machop: '腕力',
  machoke: '豪力',
  machamp: '怪力',
  bellsprout: '喇叭芽',
  weepinbell: '口呆花',
  victreebel: '大食花',
  tentacool: '玛瑙水母',
  tentacruel: '毒刺水母',
  geodude: '小拳石',
  graveler: '隆隆石',
  golem: '隆隆岩',
  ponyta: '小火马',
  rapidash: '烈焰马',
  slowpoke: '呆呆兽',
  slowbro: '呆壳兽',
  magnemite: '小磁怪',
  magneton: '三合一磁怪',
  farfetchd: '大葱鸭',
  doduo: '嘟嘟',
  dodrio: '嘟嘟利',
  seel: '小海狮',
  dewgong: '白海狮',
  grimer: '臭泥',
  muk: '臭臭泥',
  shellder: '大舌贝',
  cloyster: '刺甲贝',
  gastly: '鬼斯',
  haunter: '鬼斯通',
  gengar: '耿鬼',
  onix: '大岩蛇',
  drowzee: '催眠貘',
  hypno: '引梦貘人',
  krabby: '大钳蟹',
  kingler: '巨钳蟹',
  voltorb: '霹雳电球',
  electrode: '顽皮雷弹',
  exeggcute: '蛋蛋',
  exeggutor: '椰蛋树',
  cubone: '卡拉卡拉',
  marowak: '嘎啦嘎啦',
  hitmonlee: '飞腿郎',
  hitmonchan: '快拳郎',
  lickitung: '大舌头',
  koffing: '瓦斯弹',
  weezing: '双弹瓦斯',
  rhyhorn: '独角犀牛',
  rhydon: '钻角犀兽',
  chansey: '吉利蛋',
  tangela: '蔓藤怪',
  kangaskhan: '袋兽',
  horsea: '墨海马',
  seadra: '海刺龙',
  goldeen: '角金鱼',
  seaking: '金鱼王',
  staryu: '海星星',
  starmie: '宝石海星',
  'mr-mime': '魔墙人偶',
  scyther: '飞天螳螂',
  jynx: '迷唇姐',
  electabuzz: '电击兽',
  magmar: '鸭嘴火兽',
  pinsir: '凯罗斯',
  tauros: '肯泰罗',
  magikarp: '鲤鱼王',
  gyarados: '暴鲤龙',
  lapras: '拉普拉斯',
  ditto: '百变怪',
  eevee: '伊布',
  vaporeon: '水伊布',
  jolteon: '雷伊布',
  flareon: '火伊布',
  porygon: '多边兽',
  omanyte: '菊石兽',
  omastar: '多刺菊石兽',
  kabuto: '化石盔',
  kabutops: '镰刀盔',
  aerodactyl: '化石翼龙',
  snorlax: '卡比兽',
  articuno: '急冻鸟',
  zapdos: '闪电鸟',
  moltres: '火焰鸟',
  dratini: '迷你龙',
  dragonair: '哈克龙',
  dragonite: '快龙',
  mewtwo: '超梦',
  mew: '梦幻',
};

// 18 种属性列表
const TYPES = [
  'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fight', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

// 世代定义
const GENERATIONS = [
  { gen: 0, name: '全部世代', start: 1, end: 1025 },
  { gen: 1, name: '第一世代', start: 1, end: 151 },
  { gen: 2, name: '第二世代', start: 152, end: 251 },
  { gen: 3, name: '第三世代', start: 252, end: 386 },
  { gen: 4, name: '第四世代', start: 387, end: 493 },
  { gen: 5, name: '第五世代', start: 494, end: 649 },
  { gen: 6, name: '第六世代', start: 650, end: 721 },
  { gen: 7, name: '第七世代', start: 722, end: 809 },
  { gen: 8, name: '第八世代', start: 810, end: 905 },
  { gen: 9, name: '第九世代', start: 906, end: 1025 },
];

// 属性颜色映射
const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fight: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

// 中文属性名
const TYPE_NAMES_ZH = {
  all: '全部',
  normal: '一般',
  fire: '火',
  water: '水',
  grass: '草',
  electric: '电',
  ice: '冰',
  fight: '格斗',
  poison: '毒',
  ground: '地面',
  flying: '飞行',
  psychic: '超能力',
  bug: '虫',
  rock: '岩石',
  ghost: '幽灵',
  dragon: '龙',
  steel: '钢',
  fairy: '妖精',
};

// 属性相克关系（攻击属性 -> {防御属性: 倍率}）
const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fight: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

// 每页显示数量
const ITEMS_PER_PAGE = 50;

// 从 localStorage 加载收藏数据
function loadFavorites() {
  try {
    const stored = localStorage.getItem('pokemonFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

// 保存收藏数据到 localStorage
function saveFavorites(favorites) {
  try {
    localStorage.setItem('pokemonFavorites', JSON.stringify(Array.from(favorites)));
  } catch {
    // 忽略存储错误
  }
}

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

// 种族值中文名映射
const STAT_NAMES_ZH = {
  'hp': 'HP',
  'attack': '攻击',
  'defense': '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  'speed': '速度',
};

// 种族值顺序
const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

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

// 主应用组件
function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGen, setSelectedGen] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showTypeChart, setShowTypeChart] = useState(false);
  const [selectedAttackType, setSelectedAttackType] = useState('normal');
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // 获取宝可梦总数
  useEffect(() => {
    async function fetchPokemonCount() {
      try {
        const response = await axios.get(`${BASE_URL}/pokemon?limit=1`);
        setTotalCount(response.data.count);
      } catch (err) {
        console.error('获取总数失败:', err);
        setTotalCount(1025);
      }
    }
    fetchPokemonCount();
  }, []);

  // 获取宝可梦列表（包含类型信息）
  useEffect(() => {
    async function fetchPokemon() {
      try {
        setLoading(true);
        const limit = totalCount > 0 ? totalCount : 1025;
        const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}`);

        // 获取每个宝可梦的详细信息（包含类型）
        const pokemonDetails = await Promise.all(
          response.data.results.map(async (p, idx) => {
            const detailRes = await axios.get(p.url);
            return {
              name: p.name,
              id: idx + 1,
              types: detailRes.data.types.map(t => t.type.name),
            };
          })
        );

        setPokemonList(pokemonDetails);
        setError(null);
      } catch (err) {
        setError('加载失败：' + err.message);
      } finally {
        setLoading(false);
      }
    }
    if (totalCount > 0 || totalCount === 0) {
      fetchPokemon();
    }
  }, [totalCount]);

  // 筛选逻辑
  const filteredList = useMemo(() => {
    let filtered = [...pokemonList];

    // 按世代筛选
    if (selectedGen > 0) {
      const gen = GENERATIONS.find(g => g.gen === selectedGen);
      if (gen) {
        filtered = filtered.filter(p => p.id >= gen.start && p.id <= gen.end);
      }
    }

    // 只看收藏的宝可梦
    if (showFavoritesOnly) {
      filtered = filtered.filter((p) => favorites.has(p.id));
    }

    // 按属性筛选
    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter((p) => p.types.includes(selectedType));
    }

    // 按搜索词过滤
    if (searchQuery && searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(lowerQuery);
        const idMatch = p.id.toString() === lowerQuery;
        return nameMatch || idMatch;
      });
    }

    return filtered;
  }, [pokemonList, selectedGen, showFavoritesOnly, selectedType, searchQuery, favorites]);

  // 分页逻辑
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGen, selectedType, searchQuery, showFavoritesOnly]);

  // 获取宝可梦详情
  async function selectPokemon(pokemon) {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/pokemon/${pokemon.id}`);
      setSelectedPokemon(response.data);
      setError(null);
    } catch (err) {
      setError('加载详情失败：' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // 返回列表
  function goBack() {
    setSelectedPokemon(null);
  }

  // 切换收藏状态
  function toggleFavorite(pokemonId) {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pokemonId)) {
      newFavorites.delete(pokemonId);
    } else {
      newFavorites.add(pokemonId);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  }

  // 搜索处理
  function handleSearch(query) {
    setSearchQuery(query);
  }

  // 属性筛选处理
  function handleTypeChange(type) {
    setSelectedType(type);
  }

  // 世代筛选处理
  function handleGenChange(gen) {
    setSelectedGen(parseInt(gen));
  }

  // 收藏筛选处理
  function handleFavoritesToggle(showOnly) {
    setShowFavoritesOnly(showOnly);
  }

  // 分页处理
  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 添加到对比列表
  function addToCompare(pokemon) {
    if (compareList.length >= 2) return;
    if (compareList.some(p => p.id === pokemon.id)) return; // 避免重复添加
    setCompareList([...compareList, pokemon]);
  }

  // 从对比列表移除
  function removeFromCompare(pokemonId) {
    setCompareList(compareList.filter(p => p.id !== pokemonId));
  }

  // 清空对比列表
  function clearCompare() {
    setCompareList([]);
  }

  if (loading && !selectedPokemon && pokemonList.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: 20, color: '#666' }}>加载中... 正在获取 {totalCount || 1025} 只宝可梦</p>
      </div>
    );
  }

  if (error && !selectedPokemon) {
    return (
      <div style={styles.center}>
        <p style={{ color: '#FF5252', fontSize: 18 }}>❌ {error}</p>
      </div>
    );
  }

  // 详情页
  if (selectedPokemon) {
    return (
      <DetailView
        pokemon={selectedPokemon}
        onBack={goBack}
        loading={loading}
        onSelect={selectPokemon}
        compareList={compareList}
        onAddToCompare={addToCompare}
        onRemoveFromCompare={removeFromCompare}
        showCompare={showCompare}
        onShowCompare={setShowCompare}
      />
    );
  }

  // 列表页
  return (
    <>
      <ListView
        pokemonList={paginatedList}
        searchQuery={searchQuery}
        selectedType={selectedType}
        selectedGen={selectedGen}
        onSearch={handleSearch}
        onTypeChange={handleTypeChange}
        onGenChange={handleGenChange}
        onSelect={selectPokemon}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={handleFavoritesToggle}
        totalCount={filteredList.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        showTypeChart={showTypeChart}
        onShowTypeChart={setShowTypeChart}
        attackType={selectedAttackType}
        onAttackTypeChange={setSelectedAttackType}
        compareList={compareList}
        onShowCompare={setShowCompare}
      />
      <TypeChartModal
        show={showTypeChart}
        attackType={selectedAttackType}
        onAttackTypeChange={setSelectedAttackType}
        onClose={() => setShowTypeChart(false)}
      />
      {showCompare && compareList.length === 2 && (
        <CompareView
          compareList={compareList}
          onClose={() => setShowCompare(false)}
        />
      )}
    </>
  );
}

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
            <p style={styles.cardName}>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</p>
            {POKEMON_NAMES_ZH[p.name] && <p style={styles.cardNameZh}>{POKEMON_NAMES_ZH[p.name]}</p>}
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

// 对比视图样式
const compareStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxWidth: 900,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    padding: '20px 20px 15px',
    borderBottom: '1px solid #e5e7eb',
  },
  compareContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '20px 30px',
    gap: 10,
    borderBottom: '1px solid #e5e7eb',
  },
  pokemonSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
  },
  pokemonImage: {
    width: 180,
    height: 180,
    objectFit: 'contain',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0 8px',
    textTransform: 'capitalize',
  },
  typeBadges: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  typeBadge: {
    padding: '4px 12px',
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    display: 'flex',
    gap: 20,
    fontSize: 13,
    color: '#666',
  },
  vsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 15px',
  },
  vsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  statsSection: {
    padding: '20px 30px',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    width: 50,
    textAlign: 'center',
  },
  statValueLeft: (isWinner) => ({
    fontSize: 16,
    fontWeight: isWinner ? 'bold' : 'normal',
    color: isWinner ? '#22c55e' : '#374151',
  }),
  statValueRight: (isWinner) => ({
    fontSize: 16,
    fontWeight: isWinner ? 'bold' : 'normal',
    color: isWinner ? '#22c55e' : '#374151',
  }),
  statBarsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNameCenter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
  },
  statBarsRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  statBarWrapper: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex',
  },
  statBarLeft: {
    height: '100%',
    borderRadius: '6px 0 0 6px',
    marginRight: 'auto',
    transition: 'width 0.3s ease',
  },
  statBarRight: {
    height: '100%',
    borderRadius: '0 6px 6px 0',
    marginLeft: 'auto',
    transition: 'width 0.3s ease',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '15px 20px 25px',
    borderTop: '1px solid #e5e7eb',
  },
  closeButton: {
    padding: '12px 40px',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  },
};

// 样式定义
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: 1200,
    margin: '0 auto',
    padding: 20,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: { textAlign: 'center', marginBottom: 20, color: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', margin: '10px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
  subtitle: { fontSize: 14, opacity: 0.9 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  spinner: { width: 50, height: 50, border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  filterContainer: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 15, marginBottom: 15 },
  searchContainer: { display: 'flex', alignItems: 'center', marginBottom: 10 },
  searchInput: { flex: 1, padding: '12px 15px', fontSize: 16, border: '2px solid #e0e0e0', borderRadius: 8 },
  clearButton: { marginLeft: 10, padding: '10px 15px', backgroundColor: '#ff5252', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 15, alignItems: 'center' },
  filterItem: { display: 'flex', alignItems: 'center', gap: 8 },
  filterLabel: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  filterSelect: { padding: '8px 12px', fontSize: 14, border: '2px solid #e0e0e0', borderRadius: 8, cursor: 'pointer' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, cursor: 'pointer' },
  resultCount: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 15 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 15, textAlign: 'center', cursor: 'pointer', position: 'relative' },
  cardImage: { width: 120, height: 120, objectFit: 'contain' },
  cardId: { fontSize: 12, color: '#666', margin: '5px 0' },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#333', margin: '5px 0', textTransform: 'capitalize' },
  cardNameZh: { fontSize: 12, color: '#666', margin: '0 0 3px 0' },
  cardTypes: { display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8 },
  cardTypeBadge: { padding: '3px 8px', borderRadius: 10, color: '#fff', fontSize: 11, fontWeight: 'bold' },
  favoriteButton: { position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', padding: 5, cursor: 'pointer' },
  noResults: { textAlign: 'center', color: '#fff', padding: 40 },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 20 },
  pageButton: { padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  pageInfo: { color: '#fff', fontSize: 14 },
  backButton: { padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' },
  compareButton: { padding: '10px 16px', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold', transition: 'background-color 0.2s' },
  viewCompareButton: { padding: '10px 16px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 'bold', transition: 'background-color 0.2s' },
  detailContent: { display: 'flex', gap: 30, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 30 },
  detailImage: { width: 250, height: 250, objectFit: 'contain' },
  detailInfo: { flex: 1 },
  typeBadges: { display: 'flex', gap: 10, marginBottom: 20 },
  typeBadge: { padding: '8px 16px', borderRadius: 15, color: '#fff', fontSize: 14, fontWeight: 'bold' },
  infoRow: { display: 'flex', gap: 30, fontSize: 14, color: '#666' },
  abilitiesSection: { marginTop: 20 },
  abilitiesTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  abilitiesList: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  abilityBadge: {
    padding: '6px 14px',
    borderRadius: 20,
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  hiddenTag: { fontSize: 11, opacity: 0.9 },
  statsSection: {
    marginTop: 20,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  radarChartContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 10,
  },
  statsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statName: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  statValue: {
    width: 30,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  evolutionSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: '20px 30px',
    marginTop: 20,
  },
  evolutionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  evolutionLoading: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: '20px 0',
  },
  evolutionChain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  evolutionItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    transition: 'transform 0.2s, opacity 0.2s',
    minWidth: 100,
  },
  evolutionImage: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  evolutionName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    margin: '5px 0 2px',
    textTransform: 'capitalize',
  },
  evolutionId: {
    fontSize: 10,
    color: '#999',
    margin: 0,
  },
  evolutionArrow: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
    margin: '0 5px',
  },
  typeChartButton: {
    padding: '8px 16px',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
};

// 弹窗样式
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '50%',
    width: 30,
    height: 30,
    cursor: 'pointer',
    fontSize: 16,
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  selectRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  select: {
    padding: '10px 15px',
    fontSize: 14,
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    cursor: 'pointer',
    minWidth: 120,
  },
  tableWrapper: {
    maxHeight: 400,
    overflowY: 'auto',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#374151',
    position: 'sticky',
    top: 0,
  },
  td: {
    padding: '10px 16px',
    borderBottom: '1px solid #e5e7eb',
  },
  typeBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  effectCell: {
    textAlign: 'center',
  },
  effectBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'center',
  },
};

// 启动应用
const root = createRoot(document.getElementById('root'));
root.render(<App />);
