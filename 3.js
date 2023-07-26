const axios = require("axios");

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
    inputArray.map((asset) => {
      const fetched = flipAssets[asset];

      if (asset === "bootstrap") {
        const bootstapDepedencies = fetched.dependencies;

        const elementToShift = "jquery";
        const filteredArr = bootstapDepedencies.filter(
          (element) => element !== elementToShift
        );
        filteredArr.push(elementToShift);

        filteredArr.map((dependecyAsset) => {
          const bootstapAllVersions = Object.keys(
            flipAssets[dependecyAsset].versions
          );

          const bootstapFirstVersion = bootstapAllVersions[0];
          flipAssets[dependecyAsset].versions[bootstapFirstVersion].map(
            (versionAsset) => {
              resultsVersions.push(versionAsset);
            }
          );
        });
      }

      if (asset === "fliplet-core") {
        const flipVersions = fetched.versions;

        const flipAllVersions = Object.keys(flipVersions);

        const flipFirstVersion = flipAllVersions[0];

        flipVersions[flipFirstVersion].map((versionAsset) => {
          resultsVersions.push(versionAsset);
        });
      }

      if (asset === "moment") {
        const momentVersions = fetched.versions;

        const momentAllVersions = Object.keys(momentVersions);

        const momentFirstVersion = momentAllVersions[0];

        resultsVersions.push(momentVersions[momentFirstVersion][0]);
      }
    });

    return Promise.resolve(resultsVersions);
  } catch (error) {
    throw error;
  }
}

parse(["bootstrap", "fliplet-core", "moment", "jquery"]).then((assets) => {
  console.log("The list is", assets);
});
