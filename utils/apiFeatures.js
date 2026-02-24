// apiFeatures.js

export const filterQuery = (query, queryString) => {
  const queryObj = { ...queryString };
  ["page", "sort", "limit", "fields"].forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  return query.find(JSON.parse(queryStr));
};

export const sortQuery = (query, queryString) => {
  return queryString.sort
    ? query.sort(queryString.sort.split(",").join(" "))
    : query.sort("-createdAt");
};

export const limitFields = (query, queryString) => {
  return queryString.fields
    ? query.select(queryString.fields.split(",").join(" "))
    : query.select("-__v");
};

export const paginate = (query, queryString) => {
  const page = queryString.page * 1 || 1;
  const limit = queryString.limit * 1 || 100;
  return query.skip((page - 1) * limit).limit(limit);
};
