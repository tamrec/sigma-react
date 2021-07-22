import React, {useState, useEffect, useRef} from 'react';
import classNames from 'classnames';

import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {FileUpload} from 'primereact/fileupload';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Rating} from 'primereact/rating';
import {InputText} from 'primereact/inputtext';

import {UserService} from './UserService';

const {getUsers, createUser, removeUser, updateUser} = new UserService();

export const Users = () => {
    const emptyUser = {
        id: null,
        name: '',
        email: ''
    };

    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState(null)
    const [page, setPage] = useState({first: 0, rows: 5, page: 0, pageCount: 0});
    const [totalRecords, setTotalRecords] = useState(0)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [modified, setModified] = useState(false);
    const toast = useRef(null);


    const updateUsersList = async () => {
        const {data, totalRecords} = await getUsers(page.page, page.rows)
        setUsers(data);
        setTotalRecords(totalRecords)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, totalRecords } = await getUsers("`http://localhost:3000/users", page.page, page.rows)
            setUsers(data)
            setTotalRecords(totalRecords)
        }
        fetchUsers()
        setModified(false)
    }, [page, modified]);

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
        if (user.id) {
            updateUser(user)

        } else {
            createUser(user)
        }
        updateUsersList()
        setSubmitted(true);
        setModified(true)
        setUserDialog(false);
        setUser(emptyUser);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Utente creato', life: 3000});
    }

    const editUser = (user) => {
        setUser({...user});
        setUserDialog(true);
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    }

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    }

    const confirmDeleteUser = (user) => {
        removeUser(user.id)
        setUser(user);
        setDeleteUserDialog(true);
    }

    const deleteUser = () => {
        removeUser(user.id)
        let _users = users.filter(val => val.id !== user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Utente rimosso', life: 3000});
    }

    const confirmDeleteSelected = (user) => {
        setUser(user);
        setDeleteUsersDialog(true);
    }

    const deleteSelectedUsers = () => {
        selectedUsers.forEach(user => {
            removeUser(user.id)
        })
        let _users = users.filter(val => !selectedUsers.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({severity: 'success', summary: 'Successful', detail: 'Utenti rimossi', life: 3000});
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editUser(rowData)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)}/>
            </div>
        );
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew}/>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length}/>
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    }

    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    }

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser}/>
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUser}/>
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog}/>
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers}/>
        </>
    );

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = {...user};
        _user[`${name}`] = val;
        setUser(_user);
    }
    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast}/>
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
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog
                        visible={userDialog}
                        style={{width: '450px'}}
                        header="User Details"
                        modal
                        className="p-fluid"
                        footer={userDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="p-field">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({'p-invalid': submitted && !user.name})}/>
                            {submitted && !user.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required rows={3} cols={20}/>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteUserDialog} style={{width: '450px'}} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                            {user && <span>Are you sure you want to delete <b>{user.name}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{width: '450px'}} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                            {users && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
export default Users;
