const _ = require("lodash");

class User {
  constructor({ id, sampleData }) {
    this.id = id;
    this.sampleData = sampleData;
  }

  select(entity) {
    this.entity = entity;
    return this;
  }

  attributes(selectFields) {
    this.selectFields = selectFields;
    return this;
  }

  where(whereConditions) {
    this.whereConditions = whereConditions;
    this.whereConditions.userId = this.id;
    return this;
  }

  order(orderBy) {
    this.orderBy = orderBy;
    return this;
  }

  findAll() {
    if (
      !this.entity ||
      !this.selectFields ||
      !this.whereConditions ||
      !this.orderBy
    ) {
      return Promise.reject(new Error("Error"));
    }

    const results = _.chain(this.sampleData[this.entity])
      .filter((item) => {
        return _.every(this.whereConditions, (value, key) => {
          return _.isEqual(item[key], value);
        });
      })
      .sortBy((item) => {
        return _.map(this.orderBy, (key) => item[key]);
      })
      .map((app) => _.pick(app, this.selectFields))
      .value();

    return Promise.resolve(results);
  }

  findOne() {
    if (!this.entity || !this.selectFields || !this.whereConditions) {
      return Promise.reject(new Error("Error"));
    }

    const results = _.find(this.sampleData[this.entity], (item) => {
      return _.every(this.whereConditions, (value, key) => {
        return _.isEqual(item[key], value);
      });
    });

    if (!results) return Promise.resolve(null);

    const filteredResult = _.pick(results, this.selectFields);
    return Promise.resolve(filteredResult);
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
  sampleData,
});

user
  .select("apps")
  .attributes(["id", "title"])
  .where({ published: true })
  .order(["title"])
  .findAll()
  .then((apps) => {
    // The expected result is for the "apps" array is:
    // [ { id: 6, title: 'Et' }, { id: 1, title: 'Lorem' } ]
    console.log(apps);
  });

user
  .select("organizations")
  .attributes(["name"])
  .where({ suspended: false })
  .findOne()
  .then((organization) => {
    // The expected result is for the "organization" object is:
    // { id: 3, name: 'Fliplet' }
    console.log(organization);
  });
