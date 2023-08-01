const axios = require("axios");
const _ = require("lodash");

async function parse(inputArray) {
  try {
    const url = "https://api.fliplet.com/v1/widgets/assets";

    const results = await axios
      .get(url)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching assets:", error);
        return [];
      });

    const flipAssets = results && results.assets ? results.assets : [];

    let resultsVersions = [];

    function fetchDependencies(dependecyObj) {
      fetchVersions(dependecyObj);

      _.forEach(dependecyObj.dependencies, (dependency) => {
        if (_.get(flipAssets, `${dependency}.dependencies`)) {
          fetchDependencies(flipAssets[dependency]);
        } else {
          fetchVersions(flipAssets[dependency]);
        }
      });
    }

    function fetchVersions(dependecyObj) {
      const versions = _.keys(dependecyObj.versions);
      const firstVersion = versions[0];

      if (firstVersion && !_.isEmpty(dependecyObj.versions[firstVersion])) {
        _.forEach(dependecyObj.versions[firstVersion], (versionAsset) => {
          if (!resultsVersions.includes(versionAsset)) {
            resultsVersions.push(versionAsset);
          }
        });
      }
    }

    for (let i = 0; i < inputArray.length; i++) {
      const asset = inputArray[i];
      if (_.get(flipAssets, `${asset}.dependencies`)) {
        fetchDependencies(flipAssets[asset]);
      }
    }

    return Promise.resolve(resultsVersions);
  } catch (error) {
    throw error;
  }
}

parse(["bootstrap", "fliplet-core", "moment", "jquery"]).then((assets) => {
  console.log("The list is", assets);
});
