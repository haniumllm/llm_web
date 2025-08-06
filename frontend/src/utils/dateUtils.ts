export function formatDateString(dateStr: string | Date | null | undefined) {
  if (!dateStr) return "날짜 없음";

  // Date 객체라면 그대로 처리
  if (dateStr instanceof Date) {
    return dateStr.toLocaleDateString("ko-KR");
  }

  const str = String(dateStr);

  // ISO 날짜 문자열일 경우
  if (!isNaN(Date.parse(str))) {
    return new Date(str).toLocaleDateString("ko-KR");
  }

  // YYYYMMDD 형태일 경우
  if (str.length === 8 && /^\d+$/.test(str)) {
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    return new Date(`${year}-${month}-${day}`).toLocaleDateString("ko-KR");
  }

  return "날짜 오류";
}
