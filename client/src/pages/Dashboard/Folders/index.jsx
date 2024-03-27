import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios'

import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { BACKEND, Strings } from '@/support/Constants';

import { Button } from '@/components/Button';
import DataView from '@/components/DataView';

import { FolderItem, NewFolderItem } from './FolderItem';
import Breadcrumbs from '@/components/Breadcrumbs';

const Folders = () => {
  const { token, lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.manageUploadsFolders[lang]

  const { loading, moreLoading, noData, items, setItems, setNoData } = useMoreFetch({ method: 'folders' })
  const [create, setCreate] = useState(false)
  const [fetchErrors, setFetchErros] = useState({})

  const createFolder = (data) => {
    axios.post(`${BACKEND}/api/folder/create`, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const createdFolder = response.data;
        if (!createdFolder.error) {
          setNoData(false);
          setCreate(false);
          setItems(prev => [createdFolder, ...prev]);
          toast.success(Strings.created[lang])
        } else {
          throw new Error(createdFolder.error?.message || 'Error');
        }
      })
      .catch(err => {
        setFetchErrors({ generalCreate: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };

  const editFolder = (data) => {
    axios.put(`${BACKEND}/api/folder/edit`, data, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const updatedFolder = response.data;
        if (!updatedFolder.error) {
          const updatedItems = items.map(item => {
            if (item._id === updatedFolder._id) {
              return updatedFolder;
            }
            return item;
          });
          setItems(updatedItems);
          toast.success(Strings.edited[lang])
        } else {
          throw new Error(updatedFolder.error?.message || 'Error');
        }
      })
      .catch(err => {
        setFetchErrors({ [data.folderId]: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };

  const deleteFolder = (folderId) => {
    axios.delete(`${BACKEND}/api/folder/delete`, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: { folderId }
    })
      .then(response => {
        const data = response.data;
        if (!data.error) {
          const updatedItems = items.filter(item => item._id !== folderId);
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

  return (
    <>
      <Breadcrumbs current={Strings.manageUploadsFolders[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <div className="card_item my-5">
        <Button
          className="main hollow"
          text={Strings.createNewFolder[lang]}
          onClick={() => setCreate(!create)}
        />
      </div>

      {create && (
        <NewFolderItem
          lang={lang}
          createFolder={createFolder}
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
          <FolderItem
            {...props}
            lang={lang}
            editFolder={editFolder}
            deleteFolder={deleteFolder}
            fetchErrors={fetchErrors}
            setFetchErros={setFetchErros}
          />
        )}
        noDataMessage={Strings.noFoldersYet[lang]}
        errorMessage={Strings.unableToDisplayFolders[lang]}
      />
    </>
  )
}

export default Folders;
