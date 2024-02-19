import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const reportSchema = new Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  threadId: Types.ObjectId,
  postId: Types.ObjectId,
  title: String,
  body: String,
  createdAt: Date,
  read: {
    type: Boolean,
    default: false
  }
})
reportSchema.plugin(mongoosePaginate)

export default model('Report', reportSchema);
