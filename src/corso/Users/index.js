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

const Users = () => {
  const [users, setUsers] = useState([])
  // const dt = useRef(null);

  useEffect(() => {
    const userService = new UserService();
    userService.getUsers().then(data => {
      setUsers(data)
    })
  }, []);

  return (
    <DataTable
      // ref={dt}
      value={users}
      // selection={selectedProducts}
      // globalFilter={globalFilter}
      // header={header}
      // onSelectionChange={(e) => setSelectedProducts(e.value)}
      dataKey="id"
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25]}
      className="datatable-responsive"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
      emptyMessage="No products found."
    >
      <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
      <Column field="name" header="Name" sortable ></Column>
      <Column field="email" header="Email" sortable footer="1000" ></Column>
      {/*
      <Column field="code" header="Code" sortable body={codeBodyTemplate}></Column>
      <Column header="Image" body={imageBodyTemplate}></Column>
      <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
      <Column field="category" header="Category" sortable body={categoryBodyTemplate}></Column>
      <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
      <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable></Column>
      <Column body={actionBodyTemplate}></Column>
       */}
    </DataTable>
  )
}
export default Users
