import React, { useState, useEffect, useRef } from 'react';

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
const { getUsers } = new UserService();

const Users = () => {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState(null)
  const [page, setPage] = useState({ first: 0, rows: 5, page: 0, pageCount: 0 });
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    (
      async () => {
        const { data, totalRecords } = await getUsers(page.page, page.rows)
        setUsers(data);
        setTotalRecords(totalRecords)
      }
    )()
  }, [page]);

  const EmailTemplate = header => rowData => (
    <>
      <span className="p-column-title">{header}</span>
      <a href={'mailto:' + rowData.email}>{rowData.email}</a>
    </>
  )
  const ResponsiveTemplate = header => rowData => (
    <>
    <span className="p-column-title">{header}</span>
    {rowData.email}
    </>
  )

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <DataTable
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            first={0}
            onPage={setPage}
            dataKey="id"
            paginator
            lazy
            globalFilter="ann"
            totalRecords={totalRecords}
            rows={page.rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Stai visualizzando dal record {first} al record {last} di {totalRecords} utenti"
            emptyMessage="Non ci sono utenti."
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="name" header="Name" sortable body={ResponsiveTemplate('Name')} ></Column>
            <Column field="email" header="Email" sortable body={EmailTemplate('Email')}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  )
}
export default Users
