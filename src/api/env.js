let env = "test";

if (location.href.split("#")[0].indexOf("/master/") > -1) {
  env = "online";
} else {
  env = localStorage.getItem("in2env") || "test";
}

export default env;
