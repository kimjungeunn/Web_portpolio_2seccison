import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
const schema = new Schema({
  projectId: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0, min: 0, required: true },
}, { timestamps: true });
type ProjectStatRecord = InferSchemaType<typeof schema>;
export const ProjectStat = (models.ProjectStat as Model<ProjectStatRecord>) || model<ProjectStatRecord>('ProjectStat', schema);
