export const MAX_LINKS = 30;
export function safeUrl(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
export function validateProfile(profile) {
  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(profile.slug)) throw new Error('주소는 영문 소문자·숫자·밑줄·하이픈 3~30자로 입력하세요.');
  if (['admin','api','auth','login','signup','settings','dashboard','support','www'].includes(profile.slug)) throw new Error('다른 주소를 선택해 주세요.');
  if (!profile.display_name.trim() || profile.display_name.length > 80) throw new Error('이름은 1~80자로 입력하세요.');
  if (profile.bio.length > 500) throw new Error('소개는 500자 이내로 입력하세요.');
  if (!['violet','ocean','ink'].includes(profile.theme)) throw new Error('테마를 선택하세요.');
  if (!Array.isArray(profile.links) || profile.links.length > MAX_LINKS) throw new Error('링크는 최대 30개입니다.');
  return { ...profile, links: profile.links.map(link => {
    if (!link.label.trim() || link.label.length > 80 || link.url.length > 2048 || !safeUrl(link.url)) throw new Error('링크 이름과 올바른 HTTPS 주소를 입력하세요.');
    return { label: link.label.trim(), url: safeUrl(link.url) };
  }) };
}
