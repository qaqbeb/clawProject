import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL, ITEMS_PER_PAGE, GENERATIONS } from './data/constants';
import { styles } from './styles/index';
import ListView from './components/ListView';
import DetailView from './components/DetailView';
import CompareView from './components/CompareView';
import TypeChartModal from './components/TypeChartModal';

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

export default App;