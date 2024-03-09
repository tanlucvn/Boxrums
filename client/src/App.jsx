import { Route, Routes } from "react-router-dom";
import Store, { StoreContext } from '@/stores/Store';
import Layout from "@/components/Layout";
import Login from "@/pages/Auth/Login";
import { createContext, useContext, useEffect, useState } from "react";
import { lookInSession } from "@/common/session";
import Editor from "@/pages/editor.pages";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import PageNotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/profile.page";
import BlogPage from "@/pages/blog.page";
import SideNav from "@/components/sidenavbar.component";
import ChangePassword from "@/pages/change-password.page";
import EditProfile from "@/pages/edit-profile.page";
import Notification from "@/pages/notifications.page";
import ManageBlog from "@/pages/manage-blogs.page";
import Register from "@/pages/Auth/Register";
import BannerEditor from "./components/BannerEditor";
import SideNav2 from "@/components/sidenav2";
import Thread from "@/pages/Forum/Thread";
import Folders from "./pages/Uploads/Folders";
import Folder from "./pages/Uploads/Folder";
import File from "./pages/Uploads/File";
import Boards from "./pages/Forum/Boards";
import Dashboard from "./pages/Dashboard";
import FilePage from "./pages/Uploads/File/FilePage";
import Users from "./pages/Users";
import User from "./pages/User";
import Messages from "./pages/Messages";
import Dialogues from "./pages/Messages/Dialogues";
import Dialogue from "./pages/Messages/Dialogue";
import { AuthRoute, GeneralRoute } from "./components/ProtectedRoute";

export const UserContext = createContext({})

export const ThemeContext = createContext({})

const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {
    const { user, lang } = useContext(StoreContext)
    const [userAuth, setUserAuth] = useState({})

    const [theme, setTheme] = useState(() => darkThemePreference() ? 'dark' : 'light')

    useEffect(() => {
        let userInSession = lookInSession("user")
        let themeInSession = lookInSession('theme')
        // console.log(JSON.parse(userInSession))
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })

        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute("data-theme", themeInSession)

                return themeInSession
            })
        }
        else
            document.body.setAttribute("data-theme", theme)
    }, [])
    // console.log(userAuth)
    return (
        <Store>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <UserContext.Provider value={{ userAuth, setUserAuth }}>
                    <Routes>
                        <Route path="/editor" element={<Editor />} />
                        <Route path="/editor/:threadId" element={<Editor />} />

                        <Route path="/" element={<Layout />}>
                            <Route element={<SideNav2 />}>
                                <Route element={<GeneralRoute />}>
                                    <Route index element={<Home />} />
                                    <Route path="boards" element={<Boards />} />

                                    <Route path="uploads" element={<Folders />} />
                                    <Route path="uploads/:folderName" element={<Folder />} />

                                    <Route exact path="users/*" element={<Users />} />
                                    <Route exact path="user/:userName" element={<User />} />

                                    <Route path="/messages/*" element={<Messages />} />

                                    <Route path="/dashboard/*" element={<Dashboard />} />
                                </Route>
                            </Route>

                            <Route path="/thread/:threadId" element={<Thread />} />
                            <Route path="/file/:fileId" element={<FilePage />} />



                            <Route path="/banner" element={<BannerEditor />} />

                            <Route /* path="dashboard" */ element={<SideNav />}>
                                <Route path="notifications" element={<Notification />} />
                                <Route path="blogs" element={<ManageBlog />} />
                            </Route>

                            <Route path="settings" element={<SideNav />}>
                                <Route path="edit-profile" element={<EditProfile />} />
                                <Route path="change-password" element={<ChangePassword />} />
                            </Route>

                            <Route element={<AuthRoute />}>
                                <Route path="login" element={<Login type="sign-in" />} />
                                <Route path="register" element={<Register type="sign-up" />} />
                            </Route>

                            <Route path="search/:query" element={<SearchPage />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="blog/:blog_id" element={<BlogPage />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                    </Routes>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </Store>
    )
}

export default App;