const _ = require("lodash");

class User {
  constructor({ id }) {
    this.id = id;
  }
}

const sampleData = {
  apps: [
    { id: 1, title: "Lorem", published: true, userId: 123 },
    { id: 2, title: "Ipsum", published: false, userId: 123 },
    { id: 3, title: "Dolor", published: true, userId: 456 },
    { id: 4, title: "Sit", published: true, userId: 789 },
    { id: 5, title: "Amet", published: false, userId: 123 },
    { id: 6, title: "Et", published: true, userId: 123 },
  ],
  organizations: [
    { id: 1, name: "Google", suspended: true, userId: 123 },
    { id: 2, name: "Apple", suspended: false, userId: 456 },
    { id: 3, name: "Fliplet", suspended: false, userId: 123 },
  ],
};

const user = new User({
  id: 123,
});

// Without lodash
// const userApps = sampleData.apps
//   .filter((app) => app.userId === user.id && app.published)
//   .map((value) => {
//     return {
//       id: value.id,
//       title: value.title,
//     };
//   });

const userApps = _.map(
  _.filter(sampleData.apps, (app) => app.userId === user.id && app.published),
  (app) => _.pick(app, ["id", "title"])
);

const userOrganization = _.chain(sampleData.organizations)
  .find({ suspended: false, userId: user.id })
  .pick(["id", "name"])
  .value();

console.log(user.id);

console.log("userApps", userApps);

console.log("userOrganization", userOrganization);
