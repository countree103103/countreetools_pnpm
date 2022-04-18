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

export function generateDateTail(fileName) {
  let regResult;
  let NEW_FILENAME;
  if ((regResult = fileName.match(/(.*)\.(.*)/))) {
    //有后缀名情况
    NEW_FILENAME = `${regResult[1]}${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.${
      regResult[2]
    }`;
  } else {
    //无后缀名默认为"exe"
    NEW_FILENAME = `${fileName}${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.exe
    `;
  }

  return NEW_FILENAME;
}