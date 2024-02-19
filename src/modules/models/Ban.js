import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const banSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User'
  },
  admin: {
    type: Types.ObjectId,
    ref: 'User'
  },
  reason: String,
  body: String,
  createdAt: Date,
  expiresAt: Date
})
banSchema.plugin(mongoosePaginate)

export default model('Ban', banSchema);
