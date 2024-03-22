import { model, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: Date,
  onlineAt: Date,
  picture: String,
  karma: {
    type: Number,
    default: 0
  },
  role: {
    type: Number,
    default: 1
  },
  ban: {
    type: Types.ObjectId,
    ref: 'Ban'
  },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date
  },
  passwordReset: Date,
  bio: {
    type: String,
    maxlength: [200, 'Bio should not be more than 200'],
    default: "",
  },
  socialLinks: {
    youtube: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    }
  },
})

/** Sử dụng plugin mongoosePaginate cho Schema User để hỗ trợ phân trang dữ liệu */
userSchema.plugin(mongoosePaginate)

/** Tạo index văn bản trên các trường 'name' và 'displayName' trong collection User */
userSchema.index({ name: 'text', displayName: 'text' })

/**Middleware trước khi lưu user vào database, hash password nếu đây là user mới */
userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (err) {
    next(err)
  }
})

/** Phương thức kiểm tra tính hợp lệ của password */
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (err) {
    throw err
  }
}

userSchema.virtual('isVerified').get(function () {
  return !!(this.verified || this.passwordReset);
});

export default model('User', userSchema);
