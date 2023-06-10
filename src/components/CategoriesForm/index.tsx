import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios'
interface CategoryFormProps {
    categoryData: Category | null;
    modalType: string;
    closeModal: () => void;
}

export interface Category {
    _id?: string;
    name: string;
    description: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryData, modalType, closeModal }) => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>({
        name: categoryData?.name || '',
        description: categoryData?.description || '',
    });
    const [error, setError] = useState<string>('');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };



    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !category.name ||
            !category.description
        ) {
            setError('Fill all Fields');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        };

        try {
            const url = 'http://localhost:8080/api/category/save';
            const res = await axios.post(url, category, config);
            if (res.status === 200) alert('Category Added')
            closeModal();
        } catch (error: any) {
            if(error.response && error.response.status === 403) {
				localStorage.removeItem('token')
				localStorage.removeItem('role')
				navigate('/login')
			}
           else if (
                error.response &&
                error.response.status >= 300 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    const editCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !category.name ||
            !category.description
        ) {
            setError('fill all fields');
            return;
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            }
        };
        try {
            const url = `http://localhost:8080/api/category/update/${categoryData?._id}`;
            const res = await axios.patch(url, category, config);
            if (res.status === 200) alert('Category Updated')
            closeModal();
        } catch (error: any) {
            if(error.response && error.response.status === 403) {
				localStorage.removeItem('token')
				localStorage.removeItem('role')
				navigate('/login')
			}
            else if (
                error.response &&
                error.response.status >= 300 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };


    return (
        <div className={styles.modal_container}>
            <div
                className={styles.title}
                onClick={() => {
                    closeModal();
                }}
            >
                <AiOutlineCloseCircle size={30} />
            </div>
            <h1 className={styles.title}>
                {modalType === 'add' ? 'Add Category' : 'Edit Category'}
            </h1>

            <div className={styles.login_container}>
                <div className={styles.inner_form_elements}>
                    <div className={styles.form_item}>
                        <label htmlFor='name'>Name: </label>
                        <select
                            className={styles.input}
                            value={category.name}
                            onChange={(e:any)=>handleChange(e)}
                            name='name'
                            id='name'
                        >
                            <option value=''>Select</option>
                            <option value='COUPE'>COUPE</option>
                            <option value='SPORTS CAR'>SPORTS CAR</option>
                            <option value='STATION WAGON'>STATION WAGON</option>
                            <option value='HATCHBACK'>HATCHBACK</option>
                            <option value='CONVERTIBLE'>CONVERTIBLE</option>
                        </select>
                    </div>
                    <div className={styles.form_item}>
                        <label htmlFor='description'>Description: </label>
                        <input
                            className={styles.input}
                            type='text'
                            value={category.description}
                            onChange={(e)=>handleChange(e)}
                            name='description'
                            id='description'
                        />
                    </div>
                </div>
                {error && <div className={styles.error_msg}>{error}</div>}
                <button
                    type='submit'
                    onClick={modalType === 'add' ? addCategory : editCategory}
                    className={styles.button_modal}
                >
                    Submit
                </button>
            </div>
        </div>
    )
};

export default CategoryForm;
