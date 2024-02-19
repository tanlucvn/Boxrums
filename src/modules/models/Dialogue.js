import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const dialogueSchema = new Schema({
  from: {
    type: Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: Types.ObjectId,
    ref: 'Message'
  },
  updatedAt: Date
})
dialogueSchema.plugin(mongoosePaginate)

export default model('Dialogue', dialogueSchema);
