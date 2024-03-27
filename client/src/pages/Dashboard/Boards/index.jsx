import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { BACKEND, Strings } from '@/support/Constants';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import DataView from '@/components/DataView';

import { BoardItem, NewBoardItem } from './BoardItem';

const Boards = () => {
  const { token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.manageBoards[lang]

  const { loading, moreLoading, noData, items, setItems, setNoData } = useMoreFetch({ method: 'boards' })
  const [create, setCreate] = useState(false)
  const [fetchErrors, setFetchErros] = useState({})

  const createBoard = (data) => {
    axios.post(`${BACKEND}/api/board/create`, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const createdBoard = response.data.newBoard;
        if (!createdBoard.error) {
          setNoData(false);
          setCreate(false);
          setItems(prev => [createdBoard, ...prev]);
          toast.success(Strings.created[lang])
        } else {
          throw new Error(createdBoard.error?.message || 'Error');
        }
      })
      .catch(err => {
        setFetchErrors({ generalCreate: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };

  const editBoard = (data) => {
    axios.put(BACKEND + '/api/board/edit', data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const updatedBoard = response.data.newBoard;
        if (!updatedBoard.error) {
          const updatedItems = items.map(item => {
            if (item._id === updatedBoard._id) {
              return updatedBoard;
            }
            return item;
          });
          setItems(updatedItems);
          toast.success(Strings.edited[lang])
        } else {
          throw new Error(updatedBoard.error?.message || 'Error');
        }
      })
      .catch(err => {
        setFetchErrors({ [data.boardId]: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };

  const deleteBoard = (boardId) => {
    axios.delete(`${BACKEND}/api/board/delete`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: { boardId }
    })
      .then(response => {
        const data = response.data;
        if (!data.error) {
          const updatedItems = items.filter(item => item._id !== boardId);
          setItems(updatedItems);
          toast.success(Strings.deleted[lang]);

          if (updatedItems.length === 0) {
            setItems([]);
            setNoData(true);
          }
        } else {
          throw new Error(data.error?.message || 'Error');
        }
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
  };

  // console.log("now items", items)
  return (
    <>
      <Breadcrumbs current={Strings.manageBoards[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <div className="card_item">
        <Button
          className="my-5"
          text={Strings.createNewBoard[lang]}
          onClick={() => setCreate(!create)}
        />
      </div>

      {create && (
        <NewBoardItem
          lang={lang}
          createBoard={createBoard}
          setCreate={setCreate}
          fetchErrors={fetchErrors}
          setFetchErros={setFetchErros}
        />
      )}

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={(props) => (
          <BoardItem
            {...props}
            lang={lang}
            editBoard={editBoard}
            deleteBoard={deleteBoard}
            fetchErrors={fetchErrors}
            setFetchErros={setFetchErros}
          />
        )}
        noDataMessage={Strings.noBoardsYet[lang]}
        errorMessage={Strings.unableToDisplayBoards[lang]}
      />
    </>
  )
}

export default Boards;
