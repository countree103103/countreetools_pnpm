const css_shadow = "1px 0px 1px black";
const obj = {
  //数组第一个变量用于控制css，剩余的变量为对应文件类型的后缀名
  EXT_UNKNOW: [{ class: "fa fa-file-o", style: null }, ""],
  EXT_EXCEL: [{ class: "fa fa-file-excel-o", style: null }, "xls"],
  EXT_WORD: [
    { class: "fa fa-file-word-o", style: null },
    "word",
    "docx",
    "doc",
  ],
  EXT_IMAGE: [{ class: "fa fa-file-image-o", style: null }, "jpeg", "jpg"],
  EXT_ARCHIVE: [
    { class: "fa fa-file-zip-o", style: null },
    "rar",
    "zip",
    "7zip",
    "7z",
  ],
  EXT_AUDIO: [{ class: "fa fa-file-audio-o", style: null }, "mp3"],
  EXT_VIDEO: [{ class: "fa fa-file-video-o", style: null }, "mp4"],
  EXT_POWERPOINT: [{ class: "fa fa-file-powerpoint-o", style: null }, "ppt"],
  EXT_DIR: [
    {
      class: "fa fa-folder",
      style: { color: "yellow", "text-shadow": css_shadow },
    },
  ],
  calcClass: (value) => {
    if (value == "") {
      return obj["EXT_DIR"][0];
    }
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        if (obj[key] instanceof Array) {
          const cssObj = obj[key][0];
          const tmpArr = obj[key].slice(1);
          for (const item of tmpArr) {
            if (value.split(".")[1] == item) {
              return cssObj;
            } else {
              continue;
            }
          }
        } else {
          continue;
        }
      }
    }
    return obj.EXT_UNKNOW[0];
  },
};

export default obj;
