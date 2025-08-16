import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    link: { type: String, default: '' }
  },
  { _id: false }
);

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    github: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('UserProfile', userProfileSchema);