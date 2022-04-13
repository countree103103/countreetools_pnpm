export function formatSeconds(value) {
  const result = parseInt(value);
  const h =
    Math.floor(result / 3600) < 10
      ? "0" + Math.floor(result / 3600)
      : Math.floor(result / 3600);
  const m =
    Math.floor((result / 60) % 60) < 10
      ? "0" + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60);
  const s =
    Math.floor(result % 60) < 10
      ? "0" + Math.floor(result % 60)
      : Math.floor(result % 60);

  let res = "";
  if (h !== "00") res += `${h}小时`;
  if (m !== "00") res += `${m}分钟`;
  res += `${s}秒`;
  return res;
}

export function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      r(null);
    }, msec);
  });
}