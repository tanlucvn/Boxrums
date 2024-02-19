import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const commentSchema = new Schema({
  fileId: Types.ObjectId,
  commentedTo: Types.ObjectId,
  body: String,
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
  }]
})
commentSchema.plugin(mongoosePaginate)
commentSchema.index({ body: 'text' })

export default model('Comment', commentSchema);
