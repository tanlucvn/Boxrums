import { useContext, useEffect, useState } from "react"
import axios from 'axios'
import { UserContext } from "../App"
import { filterPaginationData } from "../common/filter-pagination-data"
import Loader from "../components/Loader"
import AnimationWrapper from "../common/page-animation"
import NoDataMessage from "../components/NoData"
import NotificationCard from "../components/notification-card.component"
import LoadMoreDataBtn from "../components/load-more.component"
import { BACKEND } from "@/support/Constants"
import { StoreContext } from "@/stores/Store"

const Notification = () => {
    let { userAuth, setUserAuth, userAuth: { access_token, new_notification_available } } = useContext(UserContext)
    const { token } = useContext(StoreContext)
    const [filter, setFilter] = useState('all')
    const filters = ['all', 'like', 'comment', 'reply']

    const [notifications, setNotifications] = useState([])
    const [page, setPage] = useState(1)
    const [nextPage, setNextPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(true)
    const limit = 10
    const [loading, setLoading] = useState(true)
    const [moreLoading, setMoreLoading] = useState(false)
    const [noData, setNoData] = useState(false)
    const [moreTrigger, setMoreTrigger] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!hasNextPage) return
            setMoreLoading(true)

            try {
                const data = await fetch(`${BACKEND}/api/notifications?limit=${limit}&page=${page}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                const response = await data.json()

                if (!response.error) {
                    setNotifications(prev => [...prev, ...response.docs])
                    setNextPage(response.nextPage)
                    setHasNextPage(response.hasNextPage)
                    setLoading(false)
                    setMoreLoading(false)
                    setNoData(false)
                    setMoreTrigger(true)
                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setLoading(false)
                setNoData(true)
                setMoreLoading(false)
            }
        }

        fetchNotifications()
        // eslint-disable-next-line
    }, [page])

    const handleFilter = (e) => {
        let btn = e.target;
        setFilter(btn.innerHTML);
        setNotifications(null)
    }

    console.log(notifications)

    return (
        <div>
            <h1 className="max-md:hidden">Recent Notification</h1>
            <div className="my-8 flex gap-6 ">
                {
                    filters.map((filterName, i) => {
                        return <button key={i} className={"py-2 " + (filter == filterName ? "btn-dark" : "btn-light")} onClick={handleFilter}>{filterName}</button>
                    })
                }
            </div>

            {
                notifications == null ? <Loader /> :
                    <>
                        {
                            notifications.length >= 0 ?
                                notifications.map((notification, i) => {
                                    return <AnimationWrapper
                                        key={i} transition={{ delay: i * 0.08 }}
                                    >
                                        <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
                                    </AnimationWrapper>
                                })
                                :
                                <NoDataMessage message='Nothing Available' />
                        }
                        {/* <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalParam={{ deletedDocCount: notifications.deletedDocCount }} /> */}
                    </>
            }
        </div>
    )
}

export default Notification