import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    network: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    validity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const Plan =
  mongoose.models.Plan ||
  mongoose.model("Plan", PlanSchema);

export default Plan;