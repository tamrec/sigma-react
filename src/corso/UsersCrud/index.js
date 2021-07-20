import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';

import { UserService } from './UserService';
const { getUsers, createUser } = new UserService();

const Users = () => {
  const emptyUser = {
    id: null,
    name: '',
    email: ''
  };

  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState(null)
  const [page, setPage] = useState({ first: 0, rows: 5, page: 0, pageCount: 0 });
  const [totalRecords, setTotalRecords] = useState(0)

  const [userDialog, setUserDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);

  const updateUsersList = async() => {
    const { data, totalRecords } = await getUsers(page.page, page.rows)
    setUsers(data);
    setTotalRecords(totalRecords)
  }

  useEffect(() => {
    updateUsersList()
  }, [page]);

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        {/* 
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
            */}
      </React.Fragment>
    )
  }

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  }

  const saveUser = () => {
    setSubmitted(true);
    createUser(user)
    updateUsersList()
    setUserDialog(false);
    setUser(emptyUser);
    
  }

  const userDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
    </>
  );

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  }
  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            first={0}
            onPage={setPage}
            dataKey="id"
            paginator
            lazy
            totalRecords={totalRecords}
            rows={page.rows}
            rowsPerPageOptions={[2, 5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Stai visualizzando dal record {first} al record {last} di {totalRecords} utenti"
            emptyMessage="Non ci sono utenti."
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="name" header="Name" sortable ></Column>
            <Column field="email" header="Email" sortable ></Column>
          </DataTable>

          <Dialog
            visible={userDialog}
            style={{ width: '450px' }}
            header="User Details"
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            <div className="p-field">
              <label htmlFor="name">Name</label>
              <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
              {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required rows={3} cols={20} />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
export default Users
