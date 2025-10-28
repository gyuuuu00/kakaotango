// src/data/bodyTypes.js
// 모든 svg를 일괄 import (Vite)
const svgModules = import.meta.glob('../assets/bodyTypes/*.svg', {
  eager: true,
  import: 'default',
});

/** 숫자 코드 -> 파일 키 매핑 (원하는대로 바꿔도 됨) */
const CODE_TO_KEY = {
  1: 'hourglass',
  2: 'inverted-pyramid',
  3: 'inverted-tower',
  4: 'pyramid',
  5: 'signpost',
  6: 'stairs',
  7: 'tower',
  8: 'wall',
};

// 표시용 이름(선택)
const KEY_TO_LABEL = {
  'hourglass': 'Hourglass',
  'inverted-pyramid': 'Inverted Pyramid',
  'inverted-tower': 'Inverted Tower',
  'pyramid': 'Pyramid',
  'signpost': 'Signpost',
  'stairs': 'Stairs',
  'tower': 'Tower',
  'wall': 'Wall',
};

function normalizeKey(raw) {
  if (raw == null) return null;
  let s = String(raw).trim().toLowerCase();

  // "유형-3", "3", "type-3" 같은 케이스
  const numMatch = s.match(/\b(\d+)\b/);
  if (numMatch) {
    const code = Number(numMatch[1]);
    return CODE_TO_KEY[code] ?? null;
  }
  // 문자로 온 경우: 공백/언더스코어 -> 하이픈
  s = s.replace(/[\s_]+/g, '-');
  return s;
}

export function resolveBodyType(rawType) {
  const key = normalizeKey(rawType);
  if (!key) return null;

  const entry = Object.entries(svgModules).find(([path]) =>
    path.endsWith(`/bodyTypes/${key}.svg`)
  );
  const image = entry?.[1] ?? null;

  return image
    ? { key, name: KEY_TO_LABEL[key] ?? key, image }
    : null;
}
