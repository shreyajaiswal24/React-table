
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import "./App.css";

const App = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState([]);
   
  

  const columns = [
    {
      name: "Name",
      selector: (row) => row.fields.Name,
      sortable: true,
    },
    {
      name: "DOB",
      selector: (row) => row.fields.DOB,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.fields.Role,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.fields.Location,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <>
          <button onClick={() => handleEdit(index)}>Edit</button>
          <button onClick={() => handleDelete(index)}>Delete</button>
        </>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "black",
        color: "white",
        fontSize: "17px",
        fontWeight: "bolder",
      },
    },
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/appPfrIrFOhFwopbH/Sheet2`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${"patue8VCMQO7c9n1I.e7aef4c85957b4d75c53c8d7534f28342f7a5eef8744cbf02e45a24d3eaf0ca6"}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) {
        throw new Error("Failed to fetch data from Airtable");
      }
  
      const result = await response.json();
      setFilteredRecords(result.records)
      console.log(filteredRecords)
      console.log(result)
      const formattedData = result.records.map((user) => ({
        name: user.fields.name || "",
        address: user.fields.address || { street: "", city: "" },
        dob: user.fields.dob || "",
        role: user.fields.role || "",
        location: user.fields.location || "",
      }));

      setRecords(formattedData);
      // setFilteredRecords(formattedData);
  
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  const handleFilter = (event) => {
    const query = event.target.value.toLowerCase();
    const newData = records.filter((row) => row.name.toLowerCase().includes(query));
    setFilteredRecords(newData);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...filteredRecords[index] });
  };

  const handleSave = () => {
    const updatedRecords = [...records];
    updatedRecords[editIndex] = editData;
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
    setFilteredRecords(updatedRecords);
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(()=>{
    console.log(filteredRecords)

  },[filteredRecords])

  return (
    <div className="homeDiv">
      <div className="search">
        <h2>Table</h2>
        <input type="text" onChange={handleFilter} placeholder="Search by Name" />
      </div>
      {editIndex !== null && (
        <div className="editForm">
          <h3>Edit User</h3>
          <input
            type="text"
            placeholder="Name"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street"
            value={editData.address.street}
            onChange={(e) =>
              setEditData({ ...editData, address: { ...editData.address, street: e.target.value } })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={editData.address.city}
            onChange={(e) =>
              setEditData({ ...editData, address: { ...editData.address, city: e.target.value } })
            }
          />
          <input
            type="date"
            placeholder="DOB"
            value={editData.dob}
            onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            value={editData.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={editData.location}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditIndex(null)}>Cancel</button>
        </div>
      )}
      <DataTable
        columns={columns}
        data={filteredRecords}
        customStyles={customStyles}
        selectableRows
        fixedHeader
        pagination
      />
    </div>
  );
};

export default App;
