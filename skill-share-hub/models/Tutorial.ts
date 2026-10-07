import {
  Schema,
  models,
  model,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export const TUTORIAL_CATEGORIES = ["coding", "cooking", "design"] as const;
export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IRating {
  user: Types.ObjectId;
  value: number; // 1-5
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITutorial extends Document {
  title: string;
  description: string;
  category: TutorialCategory;
  contentUrl: string;
  author: Types.ObjectId;
  averageRating: number;
  ratingsCount: number;
  ratings: IRating[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const RatingSchema = new Schema<IRating>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

const TutorialSchema = new Schema<ITutorial>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: TUTORIAL_CATEGORIES,
      required: [true, "Category is required"],
    },
    contentUrl: {
      type: String,
      required: [true, "Content URL is required"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratings: { type: [RatingSchema], default: [] },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

// Keep the aggregate fields in sync whenever the ratings array changes.
TutorialSchema.pre("save", function () {
  if (this.isModified("ratings")) {
    const ratings = this.ratings;
    this.ratingsCount = ratings.length;
    this.averageRating = ratings.length
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length) * 10
        ) / 10
      : 0;
  }
});

// Supports the search/filter endpoint (title/description text search + category filter)
TutorialSchema.index({ title: "text", description: "text" });

const Tutorial: Model<ITutorial> =
  models.Tutorial || model<ITutorial>("Tutorial", TutorialSchema);

export default Tutorial;