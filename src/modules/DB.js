import mongoose from "mongoose"

/**
 * Hàm kết nối tới cơ sở dữ liệu MongoDB sử dụng thư viện Mongoose.
 * Nếu biến môi trường 'MONGODB_URI' được cung cấp, hàm sẽ thực hiện kết nối tới cơ sở dữ liệu.
 * Nếu không có biến môi trường 'MONGODB_URI', hàm sẽ trả về một Promise bị reject với thông báo lỗi.
 * @returns {Promise} - Trả về một Promise: kết quả của việc kết nối tới cơ sở dữ liệu hoặc lỗi nếu 'MONGODB_URI' không được thiết lập.
 */
const DB = () => {
    if (process.env.MONGODB_URI) {
        return mongoose.connect(process.env.MONGODB_URI)
    } else {
        return new Promise((resolve, reject) => {
            reject('Set MONGODB_URI in env')
        })
    }
}

export default DB;
