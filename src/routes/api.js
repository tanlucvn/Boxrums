import express from 'express';

import { verifyAccessToken } from '../modules/utils/jwt.js';
import * as GeneralController from '../modules/controllers/generalController.js'
import * as ProfileController from '../modules/controllers/profileController.js'
import * as ForumController from '../modules/controllers/forumController.js'
import * as UploadsController from '../modules/controllers/uploadsController.js'
import * as MessagesController from '../modules/controllers/messagesController.js'

const apiRouter = express.Router();

/**
 * ==========================
 * GENERAL API
 * ==========================
 */
apiRouter.get('/search', GeneralController.search)
apiRouter.get('/stats', GeneralController.getStats)
apiRouter.get('/users', GeneralController.getUsers)
apiRouter.get('/admins', GeneralController.getAdmins)

apiRouter.get('/user', verifyAccessToken, GeneralController.getUser)
apiRouter.get('/user/stats', verifyAccessToken, GeneralController.getUserStats)
apiRouter.get('/user/threads', verifyAccessToken, GeneralController.getUserThreads)
apiRouter.get('/user/answers', verifyAccessToken, GeneralController.getUserAnswers)
apiRouter.get('/user/bans', verifyAccessToken, GeneralController.getUserBans)
apiRouter.get('/user/authHistory', verifyAccessToken, GeneralController.getAuthHistory)
apiRouter.get('/user/authHistory/search', verifyAccessToken, GeneralController.searchAuthHistory)
apiRouter.delete('/user/delete', verifyAccessToken, GeneralController.deleteUser)

apiRouter.get('/bans', GeneralController.getBans)
apiRouter.get('/ban', GeneralController.getBan)
apiRouter.post('/ban/create', verifyAccessToken, GeneralController.createBan)
apiRouter.delete('/ban/delete', verifyAccessToken, GeneralController.unBan)
apiRouter.delete('/ban/history/delete', verifyAccessToken, GeneralController.deleteBan)

apiRouter.put('/role/edit', verifyAccessToken, GeneralController.editRole)

apiRouter.get('/reports', verifyAccessToken, GeneralController.getReports)
apiRouter.post('/report/create', verifyAccessToken, GeneralController.createReport)
apiRouter.delete('/reports/delete', verifyAccessToken, GeneralController.deleteReports)

/**
 * ==========================
 * PROFILE API
 * ==========================
 */
apiRouter.get('/profile', verifyAccessToken, ProfileController.getProfile)
apiRouter.post('/profile/upload/picture', verifyAccessToken, ProfileController.uploadUserPicture)
apiRouter.post('/profile/setOnline', verifyAccessToken, ProfileController.setOnline)

apiRouter.get('/notifications', verifyAccessToken, ProfileController.getNotifications)
apiRouter.delete('/notifications/delete', verifyAccessToken, ProfileController.deleteNotifications)


/**
 * ==========================
 * FORUM API
 * ==========================
 */
apiRouter.get('/boards', ForumController.getBoards)
apiRouter.get('/board', ForumController.getBoard)
apiRouter.post('/board/create', verifyAccessToken, ForumController.createBoard)
apiRouter.delete('/board/delete', verifyAccessToken, ForumController.deleteBoard)
apiRouter.put('/board/edit', verifyAccessToken, ForumController.editBoard)

apiRouter.get('/threads', ForumController.getThreads)
apiRouter.get('/threads/recently', ForumController.getRecentlyThreads)
apiRouter.get('/threads/trending', ForumController.getTrendingThreads)
apiRouter.get('/thread', ForumController.getThread)
apiRouter.post('/thread/create', verifyAccessToken, ForumController.createThread)
apiRouter.delete('/thread/delete', verifyAccessToken, ForumController.deleteThread)
apiRouter.delete('/thread/clear', verifyAccessToken, ForumController.clearThread)
apiRouter.put('/thread/edit', verifyAccessToken, ForumController.editThread)
apiRouter.put('/thread/adminedit', verifyAccessToken, ForumController.adminEditThread)
apiRouter.put('/thread/like', verifyAccessToken, ForumController.likeThread)

apiRouter.get('/answers', ForumController.getAnswers)
apiRouter.post('/answer/create', verifyAccessToken, ForumController.createAnswer)
apiRouter.delete('/answer/delete', verifyAccessToken, ForumController.deleteAnswer)
apiRouter.put('/answer/edit', verifyAccessToken, ForumController.editAnswer)
apiRouter.put('/answer/like', verifyAccessToken, ForumController.likeAnswer)


/**
 * ==========================
 * UPLOAD API
 * ==========================
 */
apiRouter.get('/folders', UploadsController.getFolders)
apiRouter.get('/folder', UploadsController.getFolder)
apiRouter.post('/folder/create', verifyAccessToken, UploadsController.createFolder)
apiRouter.delete('/folder/delete', verifyAccessToken, UploadsController.deleteFolder)
apiRouter.put('/folder/edit', verifyAccessToken, UploadsController.editFolder)

apiRouter.get('/files', UploadsController.getFiles)
apiRouter.get('/files/all', UploadsController.getAllFiles)
apiRouter.get('/files/all/admin', verifyAccessToken, UploadsController.getAdminAllFiles)
apiRouter.get('/file', UploadsController.getFile)
apiRouter.post('/file/create', verifyAccessToken, UploadsController.createFile)
apiRouter.delete('/file/delete', verifyAccessToken, UploadsController.deleteFile)
apiRouter.put('/file/edit', verifyAccessToken, UploadsController.editFile)
apiRouter.put('/file/like', verifyAccessToken, UploadsController.likeFile)
apiRouter.put('/file/moderate', verifyAccessToken, UploadsController.moderateFile)
apiRouter.put('/file/download', UploadsController.download)

apiRouter.get('/file/comments', UploadsController.getComments)
apiRouter.post('/file/comment/create', verifyAccessToken, UploadsController.createComment)
apiRouter.delete('/file/comment/delete', verifyAccessToken, UploadsController.deleteComment)
apiRouter.put('/file/comment/like', verifyAccessToken, UploadsController.likeComment)


/**
 * ==========================
 * MESSAGES API
 * ==========================
 */
apiRouter.get('/dialogues', verifyAccessToken, MessagesController.getDialogues)
apiRouter.get('/dialogue', verifyAccessToken, MessagesController.getDialogue)

apiRouter.get('/messages', verifyAccessToken, MessagesController.getMessages)
apiRouter.post('/message/create', verifyAccessToken, MessagesController.createMessage)
apiRouter.delete('/message/delete', verifyAccessToken, MessagesController.deleteMessage)


apiRouter.get('/', (req, res) => {
    res.json({ route: 'Api router' })
})

export default apiRouter;
