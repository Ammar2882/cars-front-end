
import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdAddCircleOutline, MdDelete } from 'react-icons/md';
import Navbar from '../Navbar';
import { Category } from '../CategoriesForm';
import DataTable from 'react-data-table-component';
import Modal from 'react-modal';
import CategoryForm from '../CategoriesForm'
import axios from 'axios'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        minWidth: '400px',
        height: '300px',
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
};

const CategoryMain: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([])
    const [addModal, setAddModal] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);


    const columns = [
        {
            name: 'Name',
            selector: (row: Category) => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row: Category) => row.description,
            sortable: true,
        },
        {
            // edit button
            name: 'Edit',
            cell: (row: Category) => (
                <button
                    onClick={() => {
                        setCategoryToEdit(row);
                    }}
                    disabled={localStorage.getItem('role') === 'admin' ? false : true}
                >
                    <MdEdit />
                </button>
            ),

            button: true,
        },
        {
            // delete button 
            name: 'Delete',
            cell: (row: Category) => (
                <button
                    className={styles.delete_btn}
                    onClick={() => deleteCategory(row?._id ?? '')}
                    disabled={localStorage.getItem('role') === 'admin' ? false : true}
                >
                    <MdDelete />
                </button>
            ),

            button: true,
        }
    ]
    // close add modal 
    const closeAddModal = () => {
        setAddModal(false);
    };

    // close edit modal 
    const closeEditModal = () => {
        setCategoryToEdit(null);
    };

    useEffect(() => {
        // re load data after adding or editing a car
        getCategories();
    }, [addModal, categoryToEdit]);

    // Load category data 
    const getCategories = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('token')}`
                }
            };
            const url = `http://localhost:8080/api/category/get`;
            const res = await axios.get<Category[]>(url, config);
            if (res.status === 200) {
                setCategories(res.data);
            }

        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                navigate('/login')
            }
            console.log(error.message)
            // alert(error.message);
        }
    };

    const deleteCategory = async (id: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        };
        try {
            const url = `http://localhost:8080/api/category/delete/${id}`;
            await axios.delete(url, config);
            getCategories();
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                navigate('/login')
            }
            console.log(error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className={styles.main_container}>
            <Navbar />

            <div className={styles.data_container}>
                <div className={styles.add_btn}>
                    {/* <Link to='/Form'> */}
                    {localStorage.getItem('role') === 'admin' && <MdAddCircleOutline
                        size={40}
                        color='black'
                        onClick={() => {
                            setAddModal(true);
                        }}
                    />}

                    {/* </Link> */}
                </div>
                {categories.length > 0 ? <div className={styles.data_table}>
                    <DataTable
                        pagination
                        columns={columns}
                        data={[...categories].reverse()}
                    />
                </div> : <h3 style={{ textAlign: 'center' }}>No Categories Found</h3>}
            </div>
            <Modal
                isOpen={addModal}
                onRequestClose={closeAddModal}
                style={customStyles}
                contentLabel='Add Car Modal'
            >
                <CategoryForm categoryData={null} closeModal={closeAddModal} modalType='add' />
            </Modal>
            <Modal
                isOpen={categoryToEdit !== undefined && categoryToEdit !== null ? true : false}
                onRequestClose={closeEditModal}
                style={customStyles}
                contentLabel='Edit Car Modal'
            >
                <CategoryForm
                    closeModal={closeEditModal}
                    categoryData={categoryToEdit}
                    modalType='edit'
                />
            </Modal>
        </div>
    );

};

export default CategoryMain;
