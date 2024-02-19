import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const boardSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  title: String,
  body: String,
  position: Number,
  createdAt: Date,
  threadsCount: Number,
  answersCount: Number,
  newestThread: Date,
  newestAnswer: Date
})
boardSchema.plugin(mongoosePaginate)
boardSchema.index({ name: 'text', title: 'text', body: 'text' })

export default model('Board', boardSchema);
