import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import AddTaskModal from "./AddTaskModal";

const AgGridComponent = () => {
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log('modalopen',isModalOpen)

  const handleDelete = id => async () => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setRowData(rowData.filter(row => row._id !== id));
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleUpdate = id => async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: true });
      setRowData(prevData =>
        prevData.map(
          row => (row._id === id ? { ...row, completed: true } : row)
        )
      );
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };
  const handleAddSuccess = newTask => {
    setRowData([...rowData, newTask]);
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const DeleteButtonRenderer = ({ value }) =>
    <Button onClick={handleDelete(value)}>
      <DeleteIcon />
    </Button>;
  const UpdateButtonRenderer = ({ value }) =>
    <Button onClick={handleUpdate(value)}>
      <DoneIcon />
    </Button>;

  const columnDefs = [
    { headerName: "Title", field: "title" },
    { headerName: "Description", field: "description" },
    {
      headerName: "Status",
      field: "completed",
      cellRenderer: params => (params.value ? "Completed" : "Incomplete")
    },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: params =>
        <div>
          <DeleteButtonRenderer value={params.value} />
          <UpdateButtonRenderer value={params.value} />
        </div>
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tasks");
        setRowData(response.data);
        console.log("resdata", response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: "50vh", width: "100%" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        style={{ marginBottom: "10px" }}
      >
        Add +
      </Button>
      <AddTaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleAddSuccess}
      />
      <AddTaskModal open={isModalOpen} onClose={handleCloseModal} onSuccess />
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default AgGridComponent;
