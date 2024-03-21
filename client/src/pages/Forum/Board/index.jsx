import { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import { StoreContext } from '@/stores/Store';

import { BACKEND, Strings } from '@/support/Constants';

import { Section } from '@/components/Section';
import SortNav from '@/components/SortNav';
import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';

import Recently from './Recently';
import Answers from './Answers';
import All from './All';

const Board = () => {
    const { setPostType, setFabVisible, lang } = useContext(StoreContext)
    const { boardName } = useParams();
    const [init, setInit] = useState(true)
    const [board, setBoard] = useState({})
    const [loading, setLoading] = useState(true)
    const [noData, setNoData] = useState(false)
    const [sort, setSort] = useState('all')

    useEffect(() => {
        setFabVisible(true)
        setPostType({
            type: 'thread',
            id: board._id || null
        })
        // eslint-disable-next-line
    }, [board])

    useEffect(() => {
        // const boardFullName = board.title || Strings.board[lang]
        document.title = 'Forum | ' + board.title
        const fetchBoard = async () => {
            try {
                const data = await fetch(`${BACKEND}/api/board?name=${boardName}`)
                const response = await data.json()

                if (!response.error) {
                    setInit(false)
                    setBoard(response)
                    setLoading(false)
                    setNoData(false)
                } else throw Error(response.error?.message || 'Error')
            } catch (err) {
                setInit(false)
                setNoData(true)
                setLoading(false)
            }
        }

        init && fetchBoard()
    }, [init, board, boardName, lang])

    return (
        <Section>
            <SortNav links={[
                { title: Strings.all[lang], sort: 'all' },
                { title: Strings.recentlyAnswered[lang], sort: 'recently' },
                { title: Strings.byAnswersCount[lang], sort: 'answers' }
            ]} setSort={setSort} state={sort} />

            {!noData ? (
                !loading ? (
                    <>
                        {sort === 'answers' && <Answers boardId={board._id} lang={lang} />}
                        {sort === 'recently' && <Recently boardId={board._id} lang={lang} />}
                        {sort === 'all' && <All boardId={board._id} lang={lang} />}
                    </>
                ) : <Loader color="#64707d" />
            ) : (
                <Errorer message={Strings.unableToDisplayBoard[lang]} />
            )}
        </Section>
    )
}

export default Board;