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
import Thread from "@/pages/Forum/Thread/index_test";
import Folders from "./pages/Uploads/Folders";
import Folder from "./pages/Uploads/Folder";
import File from "./pages/Uploads/File";

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
                        <Route path="/editor/:blog_id" element={<Editor />} />
                        <Route path="/" element={<Layout />}>
                            <Route element={<SideNav2 />}>
                                <Route index element={<Home />} />
                                <Route path="boards" element={<Home />} />

                                <Route path="uploads" element={<Folders />} />
                                <Route path="uploads/:folderName" element={<Folder />} />
                                <Route path="/file/:fileId" element={<File />} />
                            </Route>

                            <Route path="/thread/:threadId" element={<Thread />} />
                            <Route path="/banner" element={<BannerEditor />} />
                            <Route path="dashboard" element={<SideNav />}>
                                <Route path="notifications" element={<Notification />} />
                                <Route path="blogs" element={<ManageBlog />} />
                            </Route>

                            <Route path="settings" element={<SideNav />}>
                                <Route path="edit-profile" element={<EditProfile />} />
                                <Route path="change-password" element={<ChangePassword />} />
                            </Route>
                            <Route path="login" element={<Login type="sign-in" />} />
                            <Route path="register" element={<Register type="sign-up" />} />
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