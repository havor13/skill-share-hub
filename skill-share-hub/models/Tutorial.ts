import mongoose, {
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

export interface ITutorial extends Document {
  title: string;
  description: string;
  category: TutorialCategory;
  contentUrl: string;
  author: Types.ObjectId;
  averageRating: number;
  ratingsCount: number;
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
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

// Supports the search/filter endpoint (title/description text search + category filter)
TutorialSchema.index({ title: "text", description: "text" });

const Tutorial: Model<ITutorial> =
  models.Tutorial || model<ITutorial>("Tutorial", TutorialSchema);

export default Tutorial;