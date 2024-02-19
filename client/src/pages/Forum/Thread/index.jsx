import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { StoreContext } from '@/stores/Store';

import { BACKEND, Strings } from '@/support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket';

import { Section } from '@/components/Section';
import { Card } from '@/components/Card';
import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';

import Answers from './Answers';
import RightSidebar from './RightSidebar';

import './style.scss'
import LeftSidebar from './LeftSidebar';

const Thread = () => {
    const { user, token, setPostType, setFabVisible, lang } = useContext(StoreContext)
    const { threadId } = useParams();
    const [headings, setHeadings] = useState([]);
    const [rightSidebarLoading, setRightSidebarLoading] = useState(true);

    useEffect(() => {
        setPostType({
            type: 'answer',
            id: threadId
        })
        // eslint-disable-next-line
    }, [threadId])

    const [joined, setJoined] = useState([])
    const [board, setBoard] = useState({})
    const [thread, setThread] = useState({})
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [likes, setLikes] = useState(thread.likes || 0);
    const [answersSubscribed, setAnswersSubscribed] = useState({})
    const [scrollAmount, setScrollAmount] = useState(0);

    useEffect(() => {
        const threadTitle = thread.title || Strings.thread[lang]
        document.title = 'Forum | ' + threadTitle
    }, [thread, lang])

    const updateLikes = (newLikes) => {
        setLikes(newLikes);
    };


    useEffect(() => {
        const fetchThread = async () => {
            try {
                const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
                const response = await data.json()

                if (!response.error) {
                    setBoard(response.board)
                    setThread(response.thread)
                    setLoading(false)
                    setNoData(false)

                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setNoData(true)
                setLoading(false)
            }
        }

        fetchThread()
    }, [threadId])

    useLayoutEffect(() => {
        const searchHeadings = setTimeout(() => {
            const contentElements = document.querySelectorAll('.md-editor-preview h1');
            const headingsData = [];

            contentElements.forEach((headingElement) => {
                const id = headingElement.id;
                const text = headingElement.textContent;
                const offsetTop = headingElement.offsetTop;
                const height = headingElement.clientHeight;

                headingsData.push({ id, text, offsetTop, height });
            });

            setHeadings(headingsData);
            if (headingsData.length > 0) {
                setRightSidebarLoading(false);
            } else {
                setRightSidebarLoading(false)
            }

        }, 1000);

        return () => clearTimeout(searchHeadings);
    }, [threadId]);

    useEffect(() => {
        const handleScroll = () => {
            const windowScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const newScrollAmount = (windowScroll / windowHeight) * 100;
            setScrollAmount(newScrollAmount);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (thread._id) joinToRoom('thread:' + thread._id, { token })
        return () => {
            if (thread._id) leaveFromRoom('thread:' + thread._id)
        }
    }, [thread._id, token])

    useEffect(() => {
        Socket.on('threadDeleted', (data) => {
            setFabVisible(false)
        })
        Socket.on('threadEdited', (data) => {
            setThread(data)
        })
        Socket.on('threadLiked', (data) => {
            setThread(data)
        })
        Socket.on('joinedList', (data) => {
            setJoined(data)
        })
        Socket.on('answerCreated', (data) => {
            setAnswersSubscribed({ type: 'answerCreated', payload: data })
        })
        Socket.on('answerDeleted', (data) => {
            setAnswersSubscribed({ type: 'answerDeleted', payload: data })
        })
        Socket.on('answerEdited', (data) => {
            setAnswersSubscribed({ type: 'answerEdited', payload: data })
        })
        Socket.on('answerLiked', (data) => {
            setAnswersSubscribed({ type: 'answerLiked', payload: data })
        })
        Socket.on('threadCleared', (data) => {
            setAnswersSubscribed({ type: 'threadCleared', payload: data })
        })
        // eslint-disable-next-line
    }, [])

    return (
        <Section>
            {!noData ? (
                !loading ? (
                    <>
                        <div class="progress-bar" style={{ width: `${scrollAmount}%` }}></div>

                        <div className='thread-container'>
                            <div className='thread-leftSidebar'>
                                <LeftSidebar data={thread} likes={likes} />
                            </div>
                            <div className="thread-content">
                                <Card data={thread} full type="thread" onLikedResData={updateLikes} joinedList={joined} />
                            </div>
                            <div className='thread-rightSidebar'>
                                <RightSidebar headings={headings} loading={rightSidebarLoading} />
                            </div>
                        </div>

                        <br />

                        <Answers
                            lang={lang}
                            user={user}
                            thread={thread}
                            subcribed={answersSubscribed}
                            clearSubcribe={setAnswersSubscribed}
                        />
                    </>
                ) : <Loader color="#64707d" />
            ) : (
                <>
                    <Errorer message={Strings.threadNotFound[lang]} />
                </>
            )}
        </Section>
    )
}

export default Thread;