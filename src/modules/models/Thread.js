import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const attachSchema = new Schema({
  file: String,
  thumb: String,
  type: String,
  size: String
})

const threadSchema = new Schema({
  boardId: Types.ObjectId,
  pined: Boolean,
  closed: Boolean,
  banner: String,
  title: String,
  desc: {
    type: String,
    maxlength: 200,
  },
  body: {
    type: []
  },
  tags: {
    type: [String],
  },
  createdAt: Date,
  author: {
    type: Types.ObjectId,
    ref: 'User'
  },
  edited: {
    createdAt: Date
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'User'
  }],
  attach: [attachSchema],
  answersCount: Number,
  newestAnswer: Date
})
threadSchema.plugin(mongoosePaginate)
threadSchema.index({ title: 'text', body: 'text' })

export default model('Thread', threadSchema);