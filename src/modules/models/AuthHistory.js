import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const authHistorySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  loginAt: Date,
  ip: String,
  ua: String
})
authHistorySchema.plugin(mongoosePaginate)
authHistorySchema.index({ ip: 'text' })

export default model('AuthHistory', authHistorySchema);
