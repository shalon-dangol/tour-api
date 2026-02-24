import express from "express";
import * as tourController from "./../controllers/tourController.js";

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route("/top-5-tours")
  .get(tourController.aliasTopTours, tourController.getAllTours);
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlans);
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour)
  .delete(tourController.deleteAllTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
