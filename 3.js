const axios = require("axios");

function parse(inputArray) {
  const url = "https://api.fliplet.com/v1/widgets/assets";

  const axiosOptions = {
    headers: {
      Origin: "", // Empty Origin header to bypass CORS preflight
    },
  };

  // Pass the complete URL (including the proxy) to Axios for the request
  return axios
    .get(url, axiosOptions)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching assets:", error);
      return [];
    });
}

parse(["bootstrap", "fliplet-core", "moment", "jquery"]).then(function (
  assets
) {
  console.log("The list is", assets);
});
