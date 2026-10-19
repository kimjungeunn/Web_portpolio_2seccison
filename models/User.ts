import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
}, { timestamps: true });
export type UserRecord = InferSchemaType<typeof userSchema>;
export const User = (models.User as Model<UserRecord>) || model<UserRecord>('User', userSchema);
