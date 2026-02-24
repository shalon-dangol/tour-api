// export const checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

import { Tour } from "../models/tourModel.js";
import apiError from "../utils/apiErrors.js";
import {
  filterQuery,
  limitFields,
  paginate,
  sortQuery,
} from "../utils/apiFeatures.js";

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// export const checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

export const aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficult";
  req.query.sort = "-ratingsAverage,price";
  next();
};
export const getAllTours = async (req, res, next) => {
  try {
    let query = filterQuery(Tour.find(), req.query);
    query = sortQuery(query, req.query);
    query = limitFields(query, req.query);
    query = paginate(query, req.query);

    //execute query
    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return next(apiError("no id found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return next(apiError("no id found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return next(apiError("no id found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllTour = async (req, res, next) => {
  try {
    await Tour.deleteMany();
    res.status(204).json({
      status: "success",
      message: "all data deleted",
    });
  } catch (err) {
    next(err);
  }
};

export const getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$difficulty",
          totalTours: { $sum: 1 }, //1 will be added counted document
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalRatings: { $sum: "$ratingsQuantity" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { $ne: "easy" },
      // },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMonthlyPlans = async (req, res, next) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    next(err);
  }
};
