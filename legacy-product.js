const legacyModel = new URLSearchParams(location.search).get("model");
const legacyRoutes = { major: "major-v.html", minor: "minor-iv.html", stanmore: "stanmore-iii.html" };
if (legacyRoutes[legacyModel]) location.replace(legacyRoutes[legacyModel] + location.hash);
