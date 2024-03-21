const BACKEND = "http://localhost:8000"
const CLIENT = "http://localhost:5173"

/* TEMPLATES

    "": {
        vi: "",
        en: ""
    }, 

*/

const Strings = {
    "loginTitle": {
        vi: "Chào mừng bạn",
        en: "Welcome Back"
    },
    "registerTitle": {
        vi: "Tham gia cộng đồng",
        en: "Join With Us"
    },
    "or": {
        vi: "hoặc",
        en: "or"
    },
    "next": {
        vi: "Tiếp theo",
        en: "Next"
    },
    "back": {
        vi: "Quay lại",
        en: "Back"
    },
    "continueWithDiscord": {
        vi: "Tiếp tục với Discord",
        en: "Continue with Discord"
    },
    "continueWithFacebook": {
        vi: "Tiếp tục với Facebook",
        en: "Continue with Facebook"
    },
    "login": {
        vi: "Đăng nhập",
        en: "Login"
    },
    "register": {
        vi: "Đăng ký",
        en: "Register"
    },
    "placeholderEmail": {
        vi: "Nhập email của bạn...",
        en: "Please enter your email..."
    },
    "enterEmail": {
        vi: "Email",
        en: "Email"
    },
    "emptyEmail": {
        vi: "Vui lòng nhập email",
        en: "Enter your email"
    },
    "emailNotValid": {
        vi: "Email không hợp lệ",
        en: "Email is not valid"
    },
    "placeholderUsername": {
        vi: "Nhập tên người dùng...",
        en: "Please enter your username..."
    },
    "username": {
        vi: "Tên người dùng",
        en: "Username"
    },
    "emptyUsername": {
        vi: "Nhập tên người dùng",
        en: "Enter your username"
    },
    "usernameNotValid": {
        vi: "Tên không hợp lệ",
        en: "Email is not valid"
    },
    "usernameMinLength": {
        vi: "Tối thiểu 3 ký tự",
        en: "At least 3 characters"
    },
    "usernameMaxLength": {
        vi: "Tối đa 21 ký tự",
        en: "Maximum 21 characters"
    },
    "placeholderPassword": {
        vi: "Vui lòng nhập mật khẩu...",
        en: "Please enter your password..."
    },
    "password": {
        vi: "Mật khẩu",
        en: "Password"
    },
    "enterPassword": {
        vi: "Nhập mật khẩu...",
        en: "Enter password..."
    },
    "emptyPassword": {
        vi: "Nhập mật khẩu",
        en: "Enter your password"
    },
    "passwordMinLength": {
        vi: "Tối thiểu 6 ký tự",
        en: "At least 6 characters"
    },
    "passwordMaxLength": {
        vi: "Tối đa 50 ký tự",
        en: "Maximum 50 characters"
    },
    "placeholderRePassword": {
        vi: "Vui lòng nhập lại mật khẩu...",
        en: "Please enter your repeat password..."
    },
    "enterRePassword": {
        vi: "Nhập lại mật khẩu",
        en: "Repeat Password"
    },
    "emptyRePassword": {
        vi: "Chưa nhập lại mật khẩu",
        en: "Enter repeat password"
    },
    "passwordNotMatch": {
        vi: "Mật khẩu không khớp",
        en: "Password not match"
    },
    "newPassword": {
        vi: "Mật khẩu mới",
        en: "New password"
    },
    "enterNewPassword": {
        vi: "Nhập mật khẩu mới...",
        en: "Enter new password...",
    },
    "emptyNewPassword": {
        vi: "Vui lòng nhập mật khẩu",
        en: "Please enter new password",
    },
    "confirmPassword": {
        vi: "Nhập lại mật khấu",
        en: "Confirm password",
    },
    "enterConfirmPassword": {
        vi: "Nhập lại mật khấu...",
        en: "Confirm password...",
    },
    "emptyConfirmPassword": {
        vi: "Vui lòng nhập lại mật khẩu",
        en: "Please enter confirm password",
    },
    "passwordChanged": {
        vi: "Mật khẩu đã được thay đổi",
        en: "Password changed successfully",
    },
    "currentPasswordNotMatch": {
        vi: "Mật khẩu cũ không chính xác",
        en: "Your current password is not correct",
    },
    "failedToFetch": {
        vi: "Lỗi máy chủ",
        en: "Failed to fetch"
    },
    "emailRegistered": {
        vi: "Email đã được đăng ký",
        en: "Email is registered"
    },
    "usernameRegistered": {
        vi: "Người dùng đã được đăng ký",
        en: "Username is registered"
    },
    "usernameNotRegistered": {
        vi: "Người dùng chưa đăng ký",
        en: "Username is not registered"
    },
    "loginNotValid": {
        vi: "Sai thông tin đăng nhập",
        en: "Username or password not valid"
    },
    "emailNotVerified": {
        vi: "Email chưa xác minh",
        en: "Email not verified"
    },
    "profile": {
        vi: "Hồ sơ",
        en: "Profile"
    },
    "dashboard": {
        vi: "Bảng điều khiển",
        en: "Dashboard"
    },
    "settings": {
        vi: "Cài đặt",
        en: "Settings"
    },
    "logout": {
        vi: "Đăng xuất",
        en: "Log out"
    },
    "generals": {
        vi: "Chung",
        en: "Generals"
    },
    "mores": {
        vi: "Khác",
        en: "Mores"
    },
    "home": {
        vi: "Trang chính",
        en: "Home"
    },
    "allBoards": {
        vi: "Tất cả chủ đề",
        en: "All boards"
    },
    "uploads": {
        vi: "Tài nguyên",
        en: "Resources"
    },
    "allUsers": {
        vi: "Xem thành viên",
        en: "All users"
    },
    "messages": {
        vi: "Trò chuyện",
        en: "Messages"
    },
    "all": {
        vi: "Tất cả",
        en: "All",
    },
    "popular": {
        vi: "Phổ biến",
        en: "Popular",
    },
    "newestAnswer": {
        vi: "Bình luận mới nhất",
        en: "Newest Answer",
    },
    "newestThread": {
        vi: "Bài đăng mới nhất",
        en: "Newest Thread",
    },
    "popularBoards": {
        vi: "Chủ đề chung",
        en: "Popular boards",
    },
    "threadNotFound": {
        vi: "Không tìm thấy bài đăng",
        en: "Thread not found",
    },

    'search': {
        vi: 'Tìm kiếm',
        en: 'Search',
    },
    'searchResults': {
        vi: 'Kết quả tìm kiếm',
        en: 'Search results',
    },
    "pleaseLogin": {
        vi: "Vui lòng đăng nhập để yêu thích bài viết này",
        en: "Please login to like this thread"
    },
    "pleaseLoginToAnswer": {
        vi: "Vui lòng đăng nhập để bình luận bài viết này",
        en: "Please login to answer this thread"
    },
    "writeSomething": {
        vi: "Hãy viết gì đó trước khi bình luận hoặc phản hồi",
        en: "Write something to leave a comment or answer"
    },
    "trending": {
        vi: "Xu hướng",
        en: "Trending"
    },
    "noThreadsYet": {
        vi: "Hiện tại chưa có bài đăng",
        en: "No threads yet",
    },
    "comment": {
        vi: "Bình luận",
        en: "Comment",
    },
    "reply": {
        vi: "Trả lời",
        en: "Reply",
    },
    "leaveAnComment": {
        vi: "Để lại một bình luận...",
        en: "Leave an comment...",
    },
    "attachFile": {
        vi: "Đính kèm tệp tin",
        en: "Attach file",
    },
    "maxFilesCount": {
        vi: "Tối đa tệp tin",
        en: "Max files count",
    },
    "maxSize": {
        vi: "Tối đa kích thước",
        en: "Max size",
    },
    "perFile": {
        vi: "mỗi tệp",
        en: "per file",
    },
    "edit": {
        vi: "Chỉnh sửa",
        en: "Edit",
    },
    'delete': {
        vi: 'Xoá',
        en: 'Delete',
    },
    'deleteAll': {
        vi: 'Xoá tất cả',
        en: 'Delete all',
    },
    "answer": {
        vi: "trả lời",
        en: "answer",
    },
    "answers": {
        vi: "trả lời",
        en: "answers",
    },
    "aiWriter": {
        vi: "Tạo bằng AI",
        en: "AI Writer",
    },
    "aiWriterTitle": {
        vi: "Tạo nội dung với AI",
        en: "Create content with AI",
    },
    "aiWriterSubtitle": {
        vi: "Viết lại nội dung của bạn bằng trí tuệ nhân tạo và tạo thành nội dung mới, độc đáo.",
        en: "Transform your content with our AI sentence rewriter and create fresh, unique text.",
    },
    "instructions": {
        vi: "Hướng dẫn",
        en: "Instructions",
    },
    "aiWriterStep1": {
        vi: "1. Điền hoặc dán nội dung bạn muốn viết lại vào đây.",
        en: "1. Transform your content with our AI sentence rewriter and create fresh, unique text.",
    },
    "aiWriterStep2": {
        vi: "2. Nhấn 'Viết lại' và AI sẽ đổi lời câu của bạn nhưng vẫn giữ nguyên ý nghĩa.",
        en: "3. Press 'Rewrite' and AI will reword your sentence keeping the same meaning.",
    },
    "aiWriterStep3": {
        vi: "3. Nội dung được tạo có thể được dịch sang ngôn ngữ hiện tại của bạn và có thể có những câu từ không chính xác.",
        en: "3. The generated content may be translated into your current language and may contain inaccuracies.",
    },
    "sentenceRewrite": {
        vi: "Nội dung muốn viết lại",
        en: "Sentence you want to rewrite",
    },
    "rewrite": {
        vi: "Viết lại",
        en: "Rewrite",
    },
    "rewriting": {
        vi: "Đang viết lại...",
        en: "Rewriting...",
    },
    "pleaseWait": {
        vi: "Vui lòng chờ",
        en: "Please wait",
    },
    "apply": {
        vi: "Áp dụng",
        en: "Apply",
    },
    "options": {
        vi: "Tuỳ chỉnh",
        en: "Options",
    },
    "pin": {
        vi: "Ghim",
        en: "Pin",
    },
    "unpin": {
        vi: "Huỷ ghim",
        en: "Unpin",
    },
    "open": {
        vi: "Mở",
        en: "Open",
    },
    "close": {
        vi: "Đóng",
        en: "Close",
    },
    "unbanUser": {
        vi: "Mở cấm người dùng",
        en: "Unban user",
    },
    "ban": {
        vi: "Cấm",
        en: "Ban",
    },
    "banUser": {
        vi: "Chặn người dùng",
        en: "Ban user",
    },
    "deleteAllAnswers": {
        vi: "Xoá tất cả bình luận",
        en: "Delete all answers",
    },
    "filesUploads": {
        vi: "Tệp tin/Tải lên",
        en: "Files/Uploads",
    },
    "manageBoards": {
        vi: "Quản lý chủ đề",
        en: "Manage boards",
    },
    "createNewBoard": {
        vi: "Tạo chủ đề mới",
        en: "Create new board",
    },
    "noBoardsYet": {
        vi: "Chưa có chủ đề",
        en: "No boards yet",
    },
    "unableToDisplayBoards": {
        vi: "Không thể hiển thị chủ đề",
        en: "Unable to display boards",
    },
    "enterShortName": {
        vi: "Nhập tên phụ",
        en: "Enter short name",
    },
    "enterTitle": {
        vi: "Nhập tên",
        en: "Enter title",
    },
    "enterPosition": {
        vi: "Nhập vị trí",
        en: "Enter position",
    },
    "boards": {
        vi: "Chủ đề",
        en: "Boards",
    },
    "admins": {
        vi: "Quản trị",
        en: "Admins",
    },
    "reports": {
        vi: "Báo cáo",
        en: "Reports",
    },
    "bans": {
        vi: "Cấm chặn",
        en: "Bans",
    },
    "thread": {
        vi: "bài đăng",
        en: "thread",
    },
    "threads": {
        vi: "bài đăng",
        en: "threads",
    },
    "adminDashboard": {
        vi: "Quản trị viên",
        en: "Admin dashboard",
    },
    "uploadsFolders": {
        vi: "Thư mục tải lên",
        en: "Uploads folders",
    },
    "moderateFiles": {
        vi: "Kiểm duyệt tệp tin",
        en: "Moderate files",
    },
    "authorizationsHistory": {
        vi: "Lịch sử đăng nhập",
        en: "Authorizations history",
    },
    "boardShortName": {
        vi: "Tên ngắn",
        en: "Board short name",
    },
    "boardTitle": {
        vi: "Tiêu hiển thị chủ đề",
        en: "Board title",
    },
    "boardDescription": {
        vi: "Mô tả",
        en: "Board description",
    },
    "enterDescription": {
        vi: "Nhập mô tả",
        en: "Enter description",
    },
    "boardPosition": {
        vi: "Vị trí chủ đề",
        en: "Boards position",
    },
    "save": {
        vi: "Lưu",
        en: "Save",
    },
    "create": {
        vi: "Tạo",
        en: "Create",
    },
    "cancel": {
        vi: "Huỷ",
        en: "Cancel",
    },
    "unread": {
        vi: "Chưa đọc",
        en: "Unread",
    },
    "read": {
        vi: "Đọc",
        en: "Read",
    },
    "noReportsYet": {
        vi: "Chưa có báo cáo",
        en: "No reports yet",
    },
    "unableToDisplayReports": {
        vi: "Không thể hiển thị báo cáo",
        en: "Unable to display reports",
    },
    "byNewest": {
        vi: "Mới nhất",
        en: "By newest",
    },
    "byAnswersCount": {
        vi: "Số lượng bình luận",
        en: "By answers count",
    },
    "noBansYet": {
        vi: "Không có mục cấm chặn",
        en: "No bans yet",
    },
    "unableToDisplayBans": {
        vi: "Không thể hiển thị cấm chặn",
        en: "Unable to display bans",
    },
    "createNewFolder": {
        vi: "Tạo thư mục mới",
        en: "Create new folder",
    },
    "file": {
        vi: "tệp tin",
        en: "file",
    },
    "files": {
        vi: "tệp tin",
        en: "files",
    },
    "noFoldersYet": {
        vi: "Không có thư mục",
        en: "No folders yet",
    },
    "manageUploadsFolders": {
        vi: "Quản lý thư mục",
        en: "Manage uploads folders",
    },
    "folderShortName": {
        vi: "Tên thư mục",
        en: "Folder short name",
    },
    "folderTitle": {
        vi: "Tiêu đề thư mục",
        en: "Folder title",
    },
    "folderDescription": {
        vi: "Mô tả thư mục",
        en: "Folder description",
    },
    "folderPosition": {
        vi: "Vị trí thư mục",
        en: "Folder position",
    },
    "unableToDisplayFolders": {
        vi: "Không thể hiển thị thư mục",
        en: "Unable to display folders",
    },
    "unableToDisplayFolder": {
        vi: "Không thể hiển thị thư mục",
        en: "Unable to display folder",
    },
    "noFilesYet": {
        vi: "Không có tệp tin",
        en: "No files yet",
    },
    "unableToDisplayFiles": {
        vi: "Không thể hiển thị tệp tin",
        en: "Unable to display files",
    },
    "needToModerate": {
        vi: "Chưa duyệt",
        en: "Need to moderate",
    },
    "download": {
        vi: "Tải xuống",
        en: "Download",
    },
    "downloads": {
        vi: "Tải xuống",
        en: "Downloads",
    },
    "downloading": {
        vi: "Đang tải xuống...",
        en: "Downloading...",
    },
    "writeTitle": {
        vi: "Vui lòng nhập tiêu đề bài viết",
        en: "Please write posts title to publish it",
    },
    "writeContent": {
        vi: "Vui lòng viết một chút nội dung cho bài viết",
        en: "Write something in your posts to publish it",
    },
    "publish": {
        vi: "Duyệt",
        en: "Publish",
    },
    "publishOn": {
        vi: "Đã đăng vào",
        en: "Publish on",
    },
    "onModeration": {
        vi: "Đang chờ duyệt",
        en: "On moderation",
    },
    "theFileWillBePublishedAfterModeration": {
        vi: "Tệp tin sẽ được xem sau khi kiểm duyệt",
        en: "The file will be published after moderation",
    },
    "fileNotFound": {
        vi: "Không tìm thấy tệp tin",
        en: "File not found",
    },
    "extension": {
        vi: "Tệp mở rộng",
        en: "Extension",
    },
    "fileSize": {
        vi: "Khối lượng tệp",
        en: "File size",
    },
    "copyFileLink": {
        vi: "Sao chép đường dẫn",
        en: "Copy file link",
    },
    "linkCopied": {
        vi: "Đã sao chép",
        en: "Link copied",
    },
    "copied": {
        vi: "Đã sao chép",
        en: "Copied",
    },
    "copyCode": {
        vi: "Sao chép mã",
        en: "Copy code",
    },
    "failedToCopyLink": {
        vi: "Sao chép thất bại",
        en: "Failed to copy link",
    },
    "newest": {
        vi: "Mới nhất",
        en: "Newest",
    },
    "oldest": {
        vi: "Cũ nhất",
        en: "Oldest",
    },
    "online": {
        vi: "Trực tuyến",
        en: "Online",
    },
    "karma": {
        vi: "Điểm",
        en: "Karma",
    },
    "unableToDisplayThreads": {
        vi: "Không thể hiển thị bài đăng",
        en: "Unable to display threads",
    },
    "noAnswersYet": {
        vi: "Không có mục bình luận",
        en: "No answers yet",
    },
    "unableToDisplayAnswers": {
        vi: "Không thể hiển thị bình luận",
        en: "Unable to display answers",
    },
    "banned": {
        vi: "Đã cấm",
        en: "Banned"
    },
    "owner": {
        vi: "Người tạo",
        en: "Owner"
    },
    "reason": {
        vi: "Lý do",
        en: "Reason",
    },
    "enterReason": {
        vi: "Nhập lý do",
        en: "Enter reason",
    },
    "content": {
        vi: "Nội dung",
        en: "Content",
    },
    "banDuration": {
        vi: "Thời hạn cấm",
        en: "Ban duration",
    },
    "banExpires": {
        vi: "Thời hạn cấm",
        en: "Ban expires",
    },
    "noResults": {
        vi: "Không có kết quả",
        en: "No results",
    },
    "isTyping": {
        vi: "đang nhập",
        en: "is typing",
    },
    "filter": {
        vi: "Lọc thông tin",
        en: "Filter",
    },
    "select": {
        vi: "Chọn tuỳ chọn",
        en: "Select option",
    },
    "selectBoards": {
        vi: "Chọn chủ đề",
        en: "Select boards",
    },
    "selectFolders": {
        vi: "Chọn thư mục",
        en: "Select folders",
    },
    "generateBanner": {
        vi: "Tạo ảnh bìa",
        en: "Generate a banner",
    },
    "themes": {
        vi: "Chủ đề",
        en: "Themes",
    },
    "title": {
        vi: "Tiêu đề",
        en: "Title",
    },
    "enterTitle": {
        vi: "Nhập tiêu đề...",
        en: "Enter title here...",
    },
    "authorOrSubtitle": {
        vi: "Tác giả hoặc tiêu đề phụ",
        en: "Author or Subtitle",
    },
    "enterAuthorOrSubtitle": {
        vi: "Nhập tác giả hoặc tiêu đề phụ...",
        en: "Enter author or subtitle here...",
    },
    "icon": {
        vi: "Biểu tượng",
        en: "Icon",
    },
    "colorBackground": {
        vi: "Màu nền",
        en: "Color Background",
    },
    "resetAll": {
        vi: "Làm mới",
        en: "Reset all",
    },
    "letsWrite": {
        vi: "Hãy viết một câu chuyện gì đó...",
        en: "Let's write a story...",
    },
    "enterTopic": {
        vi: "Vui lòng nhập tiêu đề (chủ đề) trước khi sử dụng AI tạo nội dung",
        en: "Please enter title (topic) before use AI writing content",
    },
    "desc": {
        vi: "Mô tả",
        en: "Description",
    },
    "enterDesc": {
        vi: "Nhập mô tả...",
        en: "Enter description...",
    },
    "desc": {
        vi: "Mô tả",
        en: "Description",
    },
    "shortDesc": {
        vi: "Mô tả ngắn về bài đăng của bạn",
        en: "Short description about your blog",
    },
    "charsLeft": {
        vi: "ký tự còn lại",
        en: "characters left",
    },
    "tagsLeft": {
        vi: "thẻ còn lại",
        en: "tags left",
    },
    "tags": {
        vi: "Thẻ",
        en: "Tags",
    },
    "enterTags": {
        vi: "Nhập thẻ và gửi đi để chọn...",
        en: "Type tags and enter to select...",
    },
    "tagsInformation": {
        vi: "(lọc và tìm kiếm thông tin nhanh hơn)",
        en: "(filter and search information faster)",
    },
    "similarThreads": {
        vi: "Chủ đề tương tự",
        en: "Similar Threads",
    },
    "threadIsClosed": {
        vi: "Bài đăng đã bị đóng",
        en: "Thread is closed",
    },
    "deletedSuccessfully": {
        vi: "Đã xoá thành công",
        en: "Deleted successfully",
    },
    "newThread": {
        vi: "Bài đăng mới",
        en: "New thread",
    },
    "newFile": {
        vi: "Tệp tin mới",
        en: "New file",
    },
    "january": {
        vi: "Tháng 1",
        en: "January",
    },
    "february": {
        vi: "Tháng 2",
        en: "February",
    },
    "march": {
        vi: "Tháng 3",
        en: "March",
    },
    "april": {
        vi: "Tháng 4",
        en: "April",
    },
    "may": {
        vi: "Tháng 5",
        en: "May",
    },
    "june": {
        vi: "Tháng 6",
        en: "June",
    },
    "july": {
        vi: "Tháng 7",
        en: "July",
    },
    "august": {
        vi: "Tháng 8",
        en: "August",
    },
    "september": {
        vi: "Tháng 9",
        en: "September",
    },
    "october": {
        vi: "Tháng 10",
        en: "October",
    },
    "november": {
        vi: "Tháng 11",
        en: "November",
    },
    "december": {
        vi: "Tháng 12",
        en: "December",
    },
    "unableToDisplayUserProfile": {
        vi: "Không thể hiển thị hồ sơ người dùng",
        en: "Unable to display user profile",
    },
    "hours": {
        vi: "giờ",
        en: "hours",
    },
    "minutes": {
        vi: "phút",
        en: "minutes",
    },
    "seconds": {
        vi: "giây",
        en: "seconds",
    },
    "timeExpired": {
        vi: "Hết thời gian",
        en: "Time expired",
    },
    "moderator": {
        vi: "Người kiểm duyệt",
        en: "Moderator",
    },
    "appointAsAModerator": {
        vi: "Bổ nhiệm làm người kiểm duyệt",
        en: "Appoint as a moderator",
    },
    "removeModerator": {
        vi: "Xóa người kiểm duyệt",
        en: "Remove moderator",
    },
    "deleteUser": {
        vi: "Xóa người dùng",
        en: "Delete user",
    },
    "joinedOn": {
        vi: "Tham gia vào",
        en: "Joined on",
    },
    "tryAnotherAcc": {
        vi: "Thử tài khoản khác",
        en: "Try another accounts",
    },
    "userBanned": {
        vi: "Người dùng bị cấm",
        en: "User banned",
    },
    "youAreBanned": {
        vi: "Bạn đã bị chặn",
        en: "You are banned",
    },
    "createdAt": {
        vi: "Ngày tạo",
        en: "Created at",
    },
    "topThreads": {
        vi: "Xếp hạng bài đăng",
        en: "Top threads",
    },
    "topAnswersAndComments": {
        vi: "Xếp hạng trả lời và bình luận",
        en: "Top answers and comments",
    },
    "topUploadFiles": {
        vi: "Xếp hạng đăng tệp tin",
        en: "Top upload files",
    },
    "topKarma": {
        vi: "Xếp hạng điểm",
        en: "Top karma",
    },
    "notifications": {
        vi: "Thông báo",
        en: "Notifications",
    },
    "yourThreads": {
        vi: "Bài đăng của bạn",
        en: "Your threads",
    },
    "editProfile": {
        vi: "Chỉnh sửa cá nhân",
        en: "Edit profile",
    },
    "changePassword": {
        vi: "Đổi mật khẩu",
        en: "Change password",
    },
    "report": {
        vi: "Báo cáo",
        en: "Report",
    },
    "like": {
        vi: "yêu thích",
        en: "like",
    },
    "likes": {
        vi: "yêu thích",
        en: "likes",
    },
    "upload": {
        vi: "Tải lên",
        en: "Upload",
    },
    "viewCode": {
        vi: "Xem mã",
        en: "View code",
    },
    "reportSent": {
        vi: "Đã gửi báo cáo",
        en: "Report sent",
    },
    "newNotification": {
        vi: "Thông báo mới",
        en: "New notification",
    },
    "answerToThread": {
        vi: "đã trả lời bài đăng của bạn",
        en: "answer on your thread",
    },
    "answerToAnswer": {
        vi: "đã phản hồi trả lời của bạn",
        en: "reply on your answer",
    },
    "likeThread": {
        vi: "đã thích bài đăng của bạn",
        en: "like your thread",
    },
    "likeAnswer": {
        vi: "đã thích trả lời của bạn",
        en: "like your answer",
    },
    "likeComment": {
        vi: "đã thích bình luận của bạn",
        en: "like your comment",
    },
    "commentToFile": {
        vi: "đã bình luận vào tệp tin của bạn",
        en: "comment to your file",
    },
    "commentToComment": {
        vi: "đã phản hồi bình luận của bạn",
        en: "reply to your comment",
    },
    "recentlyAnswered": {
        vi: "Trả lời gần đây",
        en: "Recently answered",
    },
    "default": {
        vi: "Bình thường",
        en: "Default",
    },
    "enterYourSearchTerm": {
        vi: "Nhập cụm từ tìm kiếm của bạn",
        en: "Enter your search term",
    },
    "customize": {
        vi: "Tuỳ chỉnh",
        en: "Customize",
    },
    "customizeLang": {
        vi: "Tuỳ chỉnh ngôn ngữ",
        en: "Customize Languages",
    },
    "vietnamese": {
        vi: "Tiếng Việt",
        en: "Vietnamese",
    },
    "english": {
        vi: "Tiếng Anh",
        en: "English",
    },
    "light": {
        vi: "Sáng",
        en: "Light",
    },
    "dark": {
        vi: "Tối",
        en: "Dark",
    },
    "verifyEmail": {
        vi: "Xác thực Email",
        en: "Verify Email",
    },
    "goToHomePage": {
        vi: "Quay lại trang chủ",
        en: "Go to home page",
    },
    "invalidToken": {
        vi: "Token không hợp lệ",
        en: "Invalid Token",
    },
    "dontTryThisAnymore": {
        vi: "Đừng thử lại lần nào nữa!",
        en: "Don't try this anymore!",
    },
    "verifyErrLine1": {
        vi: "Có vẻ như bạn đang cố thay đổi mật khẩu của mình mà không có mã thông báo hợp lệ. Hãy đảm bảo rằng bạn đã làm theo đúng hướng dẫn đặt lại mật khẩu được cung cấp trong email của mình.",
        en: "It appears that you are attempting to change your password without a valid token. Please make sure you have followed the proper password reset instructions provided in your email.",
    },
    "verifyErrLine2": {
        vi: "Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!",
        en: "Thank you for choosing our services!",
    },
    "dontHaveAnAccount": {
        vi: "Chưa có tài khoản?",
        en: "Don't have an account?",
    },
    "joinUsNow": {
        vi: "Tham gia ngay",
        en: "Join us Now",
    },
    "verifiedSuccess": {
        vi: "Xác Thực Thành Công",
        en: "Verified Successfully",
    },
    "verifySuccessLine1": {
        vi: "Email của bạn đã được xác minh thành công. Bây giờ bạn có thể đăng nhập vào tài khoản của mình.",
        en: "Your email has been successfully verified. You can now log in to your account.",
    },
    "passwordChangeSuccess": {
        vi: "Đã Thay Đổi Thành Công",
        en: "Password Changed Successfully",
    },
    "passwordChangeSuccessLine1": {
        vi: "Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập vào tài khoản của mình bằng mật khẩu mới.",
        en: "Your password has been successfully reset. You can now log in to your account using the new password.",
    },
    "forgotPassword": {
        vi: "Quên Mật Khẩu",
        en: "Forgot Password"
    },
    "passwordRestRequested": {
        vi: "Đã Yêu Cầu Đặt Lại Mật Khẩu",
        en: "Password Reset Requested"
    },
    "passwordSendSuccessLine1": {
        vi: "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng kiểm tra email của bạn",
        en: "We've received your request to reset your password. Please check your email associated with"
    },
    "passwordSendSuccessLine2": {
        vi: "Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!",
        en: "Thank you for choosing our services!",
    },
    "resetPassword": {
        vi: "Thay Đổi Mật Khẩu",
        en: "Reset Password",
    },
    "submit": {
        vi: "Gửi",
        en: "Submit",
    },
    "loginDiscord": {
        vi: "Đăng nhập với Discord",
        en: "Login with Discord"
    },
    "redirecting": {
        vi: "Đang chuyển hướng tới trang chủ...",
        en: "Redirecting to homepage..."
    },
    "nothingToRead": {
        vi: "Không có gì ở đây...",
        en: "Nothing to read here..."
    },
    "lastSeen": {
        vi: "Lần cuối thấy",
        en: "Last seen",
    },
    "profileSettings": {
        vi: "Chỉnh sửa hồ sơ",
        en: "Profile settings",
    },
    "": {
        vi: "",
        en: ""
    },









    "users": {
        vi: "Người dùng",
        en: "Users"
    },
    "noAdminsYet": {
        vi: "Không có quản trị viên",
        en: "No admins yet",
    },
    "noUsersYet": {
        vi: "Không có người dùng",
        en: "No users yet"
    },
    "noUploadsYet": {
        vi: "Không có tệp tin",
        en: "No uploads yet",
    },
    /* 
    "unableToDisplayUsers": {
        vi: "Không tìm thấy người dùng",
        en: "Unable to display users",
    },
    "newest": {
        vi: "Mới",
        en: "Newest",
    },
    "oldest": {
        vi: "Cũ",
        en: "Oldest",
    },
    "online": {
        vi: "Trực tuyến",
        en: "Online",
    },
    "karma": {
        vi: "Điểm",
        en: "Karma",
    }, */


    /* OTHER */
    'error404PageNotFound': {
        ru: 'Ошибка 404. Страница не найдена',
        en: 'Error 404. Page not found',
        jp: 'エラー404ページが見つかりません'
    },
    'notFound': {
        ru: 'Не найдено',
        en: 'Not Found',
        jp: '見つかりません'
    },
    'unableToDisplayUsers': {
        ru: 'Невозможно отобразить пользователей',
        en: 'Unable to display users',
        jp: 'ユーザーを表示できません'
    },
    'uploadProfilePicture': {
        ru: 'Загрузка изображения профиля',
        en: 'Upload profile picture',
        jp: 'プロフィール画像'
    },
    'accepted': {
        ru: 'Разрешены',
        en: 'Accepted',
        jp: '承認済み'
    },
    'recentlyThreads': {
        ru: 'Недавние треды',
        en: 'Recently threads',
        jp: '最近のスレッド'
    },
    'error': {
        ru: 'Ошибка',
        en: 'Error',
        jp: 'エラー'
    },
    'unableToDisplayBoard': {
        ru: 'Невозможно отобразить доску',
        en: 'Unable to display board',
        jp: 'ボードを表示できません'
    },
    'thread3': {
        ru: 'тредов',
        en: 'threads',
        jp: 'スレッド'
    },
    'signIn': {
        ru: 'Войти',
        en: 'Sign In',
        jp: 'ログイン'
    },
    'enterYourName': {
        ru: 'Введите свой логин',
        en: 'Enter your username',
        jp: 'ユーザー名を入力して下さい'
    },
    'logInAccount': {
        ru: 'Войти в аккаунт',
        en: 'Login account',
        jp: 'ログインアカウント'
    },
    'ifYouDontHaveAnAccount': {
        ru: 'если у вас нет аккаунта',
        en: 'if you don\'t have an account',
        jp: 'アカウントをお持ちでない場合'
    },
    'signUp': {
        ru: 'Регистрация',
        en: 'Sign Up',
        jp: '登録'
    },
    'createYourAccount': {
        ru: 'Создать учетную запись',
        en: 'Create your account',
        jp: 'アカウントを作成'
    },
    'emailAddress': {
        ru: 'Адрес электронной почты',
        en: 'Email address',
        jp: 'メールアドレス'
    },
    'createAccount': {
        ru: 'Зарегистрироваться',
        en: 'Create account',
        jp: 'アカウントを作成する'
    },
    'ifYouAlreadyHaveAnAccount': {
        ru: 'если у вас уже есть аккаунт',
        en: 'if you already have an account',
        jp: 'すでにアカウントをお持ちの場合'
    },
    'enterThreadTitle': {
        ru: 'Введите название треда',
        en: 'Enter thread title',
        jp: 'スレッドのタイトルを入力してください'
    },
    'enterContent': {
        ru: 'Введите содержание',
        en: 'Enter content',
        jp: 'コンテンツを入力してください'
    },
    'chooseFromList': {
        ru: 'Выберите из списка',
        en: 'Choose from list',
        jp: 'リストから選択'
    },
    'boardsNotLoaded': {
        ru: 'Доски не загружены',
        en: 'Boards not loaded',
        jp: 'ボードがロードされていません'
    },
    'enterDate': {
        ru: 'Введите дату',
        en: 'Enter date',
        jp: '日付を入力してください'
    },
    'threadTitle': {
        ru: 'Заголовок треда',
        en: 'Thread title',
        jp: 'スレッドタイトル'
    },
    'chooseABoard': {
        ru: 'Выберите доску',
        en: 'Choose a board',
        jp: 'ボードを選択してください'
    },
    'loading': {
        ru: 'Загрузка',
        en: 'Loading',
        jp: '荷積'
    },
    'createThread': {
        ru: 'Создать тред',
        en: 'Create thread',
        jp: 'スレッドを作成する'
    },
    'answerInThread': {
        ru: 'Ответить в тред',
        en: 'Answer in thread',
        jp: 'スレッドに答え'
    },
    'createNew': {
        ru: 'Создать тред',
        en: 'Create new',
        jp: '新しく作る'
    },
    'rules': {
        ru: 'Правила',
        en: 'Rules',
        jp: 'ルール'
    },
    'enterForSearch': {
        ru: 'Введите для поиска',
        en: 'Enter for search',
        jp: '検索'
    },
    'noNotificationYet': {
        ru: 'Уведомлений пока нет',
        en: 'No notification yet',
        jp: 'まだ通知はありません'
    },
    'deleteAllNotifications': {
        ru: 'Удалить все уведомления',
        en: 'Delete all notifications',
        jp: 'すべての通知を削除します'
    },
    'unableToDisplayNotifications': {
        ru: 'Невозможно отобразить уведомления',
        en: 'Unable to display notifications',
        jp: '通知を表示できません'
    },
    'openProfile': {
        ru: 'Открыть профиль',
        en: 'Open profile',
        jp: 'プロフィールを開く'
    },
    'language': {
        ru: 'Язык',
        en: 'Language',
        jp: '言語'
    },
    'toggleTheme': {
        ru: 'Переключить тему',
        en: 'Toggle theme',
        jp: 'テーマを切り替える'
    },
    'chooseAFile': {
        ru: 'Выберите файл',
        en: 'Choose a file',
        jp: 'ファイルを選択してください'
    },
    'choose': {
        vi: 'Chọn',
        en: 'Choose',
    },
    'fileNotSelected': {
        vi: 'Chưa chọn tệp',
        en: 'File not selected',
    },
    'textFieldSupportsMarkdown': {
        ru: 'Текстовое поле поддерживает Markdown',
        en: 'Text field supports Markdown',
        jp: 'テキストフィールドはMarkdownをサポートします'
    },
    'unableToDisplaySearchResults': {
        ru: 'Невозможно отобразить результаты поиска',
        en: 'Unable to display search results',
        jp: '検索結果を表示できません'
    },
    'showMore': {
        ru: 'Показать полностью',
        en: 'Show more',
        jp: '完全に表示'
    },
    'showLess': {
        ru: 'Свернуть',
        en: 'Show less',
        jp: '表示を減らす'
    },
    'folder': {
        ru: 'Папка',
        en: 'Folder',
        jp: 'フォルダ'
    },
    'download1': {
        ru: 'скачивание',
        en: 'download',
        jp: 'ダウンロード'
    },
    'download2': {
        ru: 'скачивания',
        en: 'downloads',
        jp: 'ダウンロード'
    },
    'download3': {
        ru: 'скачиваний',
        en: 'downloads',
        jp: 'ダウンロード'
    },
    'fileTitle': {
        ru: 'Заголовок файла',
        en: 'File title',
        jp: 'ファイルタイトル'
    },
    'chooseAFolder': {
        ru: 'Выберите папку',
        en: 'Choose a folder',
        jp: 'フォルダを選択してください'
    },
    'yourFile': {
        ru: 'Ваш файл',
        en: 'Your file',
        jp: 'あなたのファイル'
    },
    'uploadFile': {
        ru: 'Загрузить файл',
        en: 'Upload file',
        jp: 'ファイルをアップロードする'
    },
    'foldersNotLoaded': {
        ru: 'Папки не загружены',
        en: 'Folders not loaded',
        jp: 'フォルダーがロードされていません'
    },
    'fileDeleted': {
        ru: 'Файл удален',
        en: 'File deleted',
        jp: 'ファイルが削除されました'
    },
    'editFile': {
        ru: 'Редактировать файл',
        en: 'Edit file',
        jp: 'ファイル編集'
    },
    'comments': {
        ru: 'Комментарии',
        en: 'Comments',
        jp: 'コメント'
    },
    'noCommentsYet': {
        ru: 'Пока нет комментариев',
        en: 'No comments yet',
        jp: 'コメントはまだありません'
    },
    'enterYourComment': {
        ru: 'Введите комментарий',
        en: 'Enter your comment',
        jp: 'コメントを入力してください'
    },
    'unableToDisplayProfileInfo': {
        ru: 'Невозможно отобразить информацию профиля',
        en: 'Unable to display profile info',
        jp: 'プロファイル情報を表示できません'
    },
    'noMessagesYet': {
        ru: 'Пока нет сообщений',
        en: 'No messages yet',
        jp: 'まだメッセージはありません'
    },
    'unableToDisplayMessages': {
        ru: 'Невозможно отобразить сообщения',
        en: 'Unable to display messages',
        jp: 'メッセージを表示できません'
    },
    'message': {
        ru: 'Сообщение',
        en: 'Message',
        jp: 'メッセージ'
    },
    'you': {
        ru: 'Вы',
        en: 'You',
        jp: '君は'
    },
    'dialogueWith': {
        ru: 'Диалог с',
        en: 'Dialogue with',
        jp: 'との対話'
    },
    'enterYourMessage': {
        ru: 'Введите сообщение',
        en: 'Enter your message',
        jp: 'メッセージを入力してください'
    },
    'noInternetConnection': {
        ru: 'Нет подключения к интернету',
        en: 'No internet connection',
        jp: 'インターネットに接続できません'
    },
    'passwordChange': {
        ru: 'Смена пароля',
        en: 'Password change',
        jp: 'パスワードの変更'
    },
    'searchIn': {
        ru: 'Искать в',
        en: 'Search in',
        jp: 'で検索'
    },
    'userHasNotLoggedInYet': {
        ru: 'Пользователь еще не авторизовывался',
        en: 'User has not logged in yet',
        jp: 'ユーザーはまだログインしていません'
    },
    'unableToDisplayAuthorizationsHistory': {
        ru: 'Невозможно отобразить историю авторизаций',
        en: 'Unable to display authorizations history',
        jp: '承認履歴を表示できません'
    },
    'isViewing': {
        ru: 'в треде',
        en: 'is viewing',
        jp: 'ウォッチング'
    },
}

const imageTypes = ["image/jpeg", "image/pjpeg", "image/png", "image/gif", "image/webp", "image/vnd.microsoft.icon"]
const videoTypes = ["video/mp4", "video/webm", "video/avi", "video/msvideo", "video/x-msvideo", "video/mpeg", "video/3gpp", "video/quicktime"]
const fileExt = /(?:\.([^.]+))?$/

export { BACKEND, CLIENT, Strings, imageTypes, videoTypes, fileExt };