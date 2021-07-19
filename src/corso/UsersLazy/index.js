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

  return (
    <>
      {JSON.stringify(page, null, 2)}
      <DataTable
        value={users}
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
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
        emptyMessage="No products found."
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="name" header="Name" sortable ></Column>
        <Column field="email" header="Email" sortable footer="1000" ></Column>
      </DataTable>
    </>
  )
}
export default Users
