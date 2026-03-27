// API 基础 URL
export const BASE_URL = 'https://pokeapi.co/api/v2';

// 18 种属性列表
export const TYPES = [
  'all', 'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fight', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

// 世代定义
export const GENERATIONS = [
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
export const TYPE_COLORS = {
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
export const TYPE_NAMES_ZH = {
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

// 宝可梦中文名映射已移至 pokemon-names-zh.js（支持全部9世代1025只）

// 属性相克关系（攻击属性 -> {防御属性: 倍率}）
export const TYPE_CHART = {
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

// 种族值中文名映射
export const STAT_NAMES_ZH = {
  'hp': 'HP',
  'attack': '攻击',
  'defense': '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  'speed': '速度',
};

// 种族值顺序
export const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

// 每页显示数量
export const ITEMS_PER_PAGE = 50;

// 特性中文名和描述映射
export const ABILITIES_ZH = {
  // 御三家特性
  overgrow: { name: '茂盛', desc: 'HP减少时，草属性招式威力提升' },
  blaze: { name: '猛火', desc: 'HP减少时，火属性招式威力提升' },
  torrent: { name: '激流', desc: 'HP减少时，水属性招式威力提升' },

  // 天气相关特性
  chlorophyll: { name: '叶绿素', desc: '晴朗天气时，速度提升' },
  swift_swim: { name: '悠游自如', desc: '雨天时速度提升' },
  rain_dish: { name: '雨盘', desc: '雨天时回复HP' },
  drought: { name: '日照', desc: '出场时变为晴朗天气' },
  drizzle: { name: '降雨', desc: '出场时变为雨天' },
  sand_veil: { name: '沙隐', desc: '沙暴时，回避率提高' },
  sand_stream: { name: '扬沙', desc: '出场时变为沙暴天气' },
  snow_cloak: { name: '雪隐', desc: '冰雹时，回避率提高' },
  snow_warning: { name: '降雪', desc: '出场时变为冰雹天气' },

  // 免疫/吸收类特性
  water_absorb: { name: '储水', desc: '水属性招式回复HP' },
  volt_absorb: { name: '蓄电', desc: '电属性招式回复HP' },
  flash_fire: { name: '引火', desc: '受火属性招式攻击时提升火属性招式威力' },
  lightning_rod: { name: '避雷针', desc: '将电属性招式引向自己，提升特攻' },
  storm_drain: { name: '引水', desc: '将水属性招式引向自己，提升特攻' },
  motor_drive: { name: '电气引擎', desc: '受电属性招式攻击时提升速度' },
  sap_sipper: { name: '食草', desc: '受草属性招式攻击时提升攻击' },
  earth_eater: { name: '食土', desc: '受地面属性招式攻击时回复HP' },
  wind_rider: { name: '乘风', desc: '受风招式攻击时提升攻击' },
  well_baked_body: { name: '焦香之躯', desc: '受火属性招式攻击时大幅提升防御' },
  thermal_exchange: { name: '热交换', desc: '受火属性招式攻击时提升攻击' },

  // 接触惩罚特性
  static: { name: '静电', desc: '接触时可能让对手麻痹' },
  poison_point: { name: '毒刺', desc: '接触时可能让对手中毒' },
  flame_body: { name: '火焰之躯', desc: '接触时可能让对手灼伤' },
  cute_charm: { name: '迷人之躯', desc: '接触时可能让对手着迷' },
  effect_spore: { name: '孢子', desc: '接触时可能让对手麻痹、中毒或睡眠' },
  rough_skin: { name: '粗糙皮肤', desc: '接触时让对手受到伤害' },
  iron_barbs: { name: '铁刺', desc: '接触时让对手受到伤害' },
  gooey: { name: '黏滑', desc: '接触时降低对手速度' },
  tangling_hair: { name: '卷发', desc: '接触时降低对手速度' },
  stamina: { name: '毅力', desc: '受攻击时提升防御' },
  berserk: { name: '怒气冲冲', desc: 'HP减少时提升特攻' },
  anger_point: { name: '怒火冲天', desc: '被击中要害时攻击大幅提升' },

  // 免疫类特性
  levitate: { name: '漂浮', desc: '免疫地面属性招式' },
  immunity: { name: '免疫', desc: '不会中毒' },
  limber: { name: '柔软', desc: '不会麻痹' },
  insomnia: { name: '不眠', desc: '不会睡眠' },
  vital_spirit: { name: '干劲', desc: '不会睡眠' },
  water_veil: { name: '水之掩护', desc: '不会灼伤' },
  magma_armor: { name: '熔岩铠甲', desc: '不会冰冻' },
  oblivious: { name: '迟钝', desc: '不会着迷和挑衅' },
  own_tempo: { name: '我行我素', desc: '不会混乱' },
  inner_focus: { name: '精神力', desc: '不会畏缩' },
  shield_dust: { name: '鳞粉', desc: '不受招式追加效果影响' },
  bulletproof: { name: '防弹', desc: '免疫球和弹类招式' },
  soundproof: { name: '隔音', desc: '免疫声音类招式' },
  sucker_punch: { name: '突袭', desc: '先制攻击招式威力提升' },

  // 能力变化特性
  intimidate: { name: '威吓', desc: '出场时降低对手攻击' },
  dauntless_shield: { name: '不屈之盾', desc: '出场时提升防御' },
  download: { name: '下载', desc: '出场时根据对手防御提升攻击或特攻' },
  trace: { name: '追踪', desc: '复制对手的特性' },
  huge_power: { name: '大力士', desc: '物理攻击威力翻倍' },
  pure_power: { name: '瑜伽之力', desc: '物理攻击威力翻倍' },
  sheer_force: { name: '强行', desc: '追加效果消失但威力提升' },
  technician: { name: '技术高手', desc: '威力60以下的招式威力提升' },
  adaptability: { name: '适应力', desc: '本系招式威力更高' },
  analytic: { name: '分析', desc: '最后出手时威力提升' },
  sniper: { name: '狙击手', desc: '击中要害时伤害更高' },
  strong_jaw: { name: '强壮之颚', desc: '咬类招式威力提升' },
  mega_launcher: { name: '超级发射器', desc: '波动类招式威力提升' },
  iron_fist: { name: '铁拳', desc: '拳击类招式威力提升' },
  skill_link: { name: '连续攻击', desc: '连续招式必定打满' },
  hustle: { name: '活力', desc: '攻击提升但命中率降低' },
  guts: { name: '毅力', desc: '异常状态时攻击提升' },
  marvel_scale: { name: '奇迹皮肤', desc: '异常状态时防御提升' },
  quick_feet: { name: '飞毛腿', desc: '异常状态时速度提升' },
  toxic_boost: { name: '毒暴走', desc: '中毒时攻击提升' },
  flare_boost: { name: '热暴走', desc: '灼伤时特攻提升' },

  // 场地相关特性
  grass_pelt: { name: '草之毛皮', desc: '草场时防御提升' },
  surge_surfer: { name: '冲浪之尾', desc: '电气场地时速度提升' },

  // 辅助特性
  synchronize: { name: '同步', desc: '将异常状态传递给对手' },
  natural_cure: { name: '自然回复', desc: '退场时治愈异常状态' },
  hydration: { name: '湿润之躯', desc: '雨天时治愈异常状态' },
  shed_skin: { name: '蜕皮', desc: '有可能治愈异常状态' },
  magic_guard: { name: '魔法守护', desc: '不受除了直接攻击以外的伤害' },
  magic_bounce: { name: '魔法镜', desc: '反弹变化招式' },
  sticky_hold: { name: '黏着', desc: '道具不会被抢走' },
  pickpocket: { name: '顺手牵羊', desc: '接触时抢夺对手道具' },
  frisk: { name: '看穿', desc: '出场时查看对手道具' },
  item_master: { name: '道具大师', desc: '无视道具使用限制' },
  klutz: { name: '笨手笨脚', desc: '无法使用道具' },
  runaway: { name: '逃跑', desc: '一定能从野生宝可梦那里逃走' },
  keen_eye: { name: '锐利目光', desc: '命中率不会被降低' },
  tangled_feet: { name: '蹒跚', desc: '混乱时，回避率提高' },
  rivalry: { name: '竞争心', desc: '对手性别相同时，攻击提升' },
  stench: { name: '恶臭', desc: '可能让对手畏缩' },
  speed_boost: { name: '加速', desc: '每回合速度提升' },
  moody: { name: '心情不定', desc: '每回合能力随机变化' },
  cursed_body: { name: '诅咒之躯', desc: '接触时可能封印对手招式' },
  weak_armor: { name: '碎裂铠甲', desc: '受物理攻击时速度提升防御降低' },
  battle_armor: { name: '战斗盔甲', desc: '不会被击中要害' },
  shell_armor: { name: '硬壳盔甲', desc: '不会被击中要害' },
  clear_body: { name: '洁癖', desc: '能力不会被降低' },
  white_smoke: { name: '白色烟雾', desc: '能力不会被降低' },
  hyper_cutter: { name: '怪力钳', desc: '攻击不会被降低' },

  // 状态变化特性
  poison_heal: { name: '毒疗', desc: '中毒时回复HP' },

  // 道具相关特性
  pickup: { name: '捡拾', desc: '战斗后可能捡到道具' },
  harvest: { name: '收获', desc: '可能回收用过的树果' },
  gluttony: { name: '贪吃鬼', desc: 'HP低时提前吃树果' },
  unburden: { name: '轻装', desc: '消耗道具后速度提升' },

  // 变形类特性
  libero: { name: '自由者', desc: '使用招式后变为对应属性' },
  protean: { name: '变幻自如', desc: '使用招式后变为对应属性' },
  illusion: { name: '幻觉', desc: '出场时伪装成队友' },
  imposter: { name: '冒充者', desc: '出场时变身成对手' },
  disguise: { name: '画皮', desc: '首次攻击不受伤但画皮消失' },
  ice_face: { name: '冰冻面孔', desc: '首次物理攻击不受伤但变形' },
  battle_bond: { name: '战斗羁绊', desc: '击倒对手后变为强化形态' },
  power_construct: { name: '气场', desc: 'HP减少时变为完全形态' },
  schooling: { name: '鱼群', desc: '等级高时变为群体形态' },
  shields_down: { name: '护盾', desc: 'HP减少时暴露核心' },
  stance_change: { name: '战斗切换', desc: '使用招式后切换形态' },

  // 其他特性
  pressure: { name: '压迫感', desc: '对手使用招式时消耗更多PP' },
  multiscale: { name: '多重鳞片', desc: 'HP满时受到的伤害减半' },
  shadow_tag: { name: '影踏', desc: '对手无法逃跑' },
  arena_trap: { name: '沙穴', desc: '地面属性对手无法逃跑' },
  magnet_pull: { name: '磁力', desc: '钢属性对手无法逃跑' },
  mold_breaker: { name: '破格', desc: '无视对手特性' },
  teravolt: { name: '涡轮火焰', desc: '无视对手特性' },
  turboblaze: { name: '涡轮火焰', desc: '无视对手特性' },
  infiltrator: { name: '穿透', desc: '无视对手壁障和替身' },
  prankster: { name: '恶作剧之心', desc: '变化招式优先度提升' },
  gale_wings: { name: '疾风之翼', desc: '飞行招式优先度提升' },
  triage: { name: '治疗之心', desc: '回复招式优先度提升' },
  stall: { name: '慢启动', desc: '行动顺序必定最后' },
  slow_start: { name: '慢启动', desc: '前五回合攻击和速度减半' },
  defeatist: { name: '败弱', desc: 'HP减少时攻防减半' },
  truant: { name: '懒惰', desc: '每回合交替行动' },
};