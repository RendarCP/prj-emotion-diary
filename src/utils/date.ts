export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateToKorean = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekday}요일`;
};

export const getCurrentDate = (): string => {
  return formatDate(new Date());
};

export const getDateWithOffset = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return formatDate(date);
};
