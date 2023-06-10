import React, { useState, useEffect } from 'react';
import { MdEdit, MdAddCircleOutline, MdDelete } from 'react-icons/md';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Form from '../Form';
import styles from './styles.module.css';
import Modal from 'react-modal';

interface Car {
	_id?: string;
	model: string;
	manufacturer: string;
	category: string;
	color: string[];
	make: string;
	power: string;
	registrationNumber: string;
	desc: string;
}

// styles for modal
const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		maxWidth: '600px',
		minWidth: '500px',
		height: '500px',
		background: '#fff',
		borderRadius: '8px',
		padding: '20px',
		boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
	},
};

const Home: React.FC = () => {
	const [carsData, setCarsData] = useState<Car[]>([]);
	const [addModal, setAddModal] = useState<boolean>(false);
	const [carToEdit, setCarToEdit] = useState<Car | null>(null);


	const navigate = useNavigate()

	// Load car data 
	const getdata = async () => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${localStorage.getItem('token')}`
				}
			};
			const url = `http://localhost:8080/api/cars/`;
			const res = await axios.get<Car[]>(url, config);
			if (res.status === 200) setCarsData(res.data);
		} catch (error: any) {
			if (error.response && error.response.status === 403) {
				localStorage.removeItem('token')
				localStorage.removeItem('role')
				navigate('/login')
			}
			console.log(error)
			// alert(error.message);
		}
	};

	// close add modal 
	const closeAddModal = () => {
		setAddModal(false);
	};

	// close edit modal 
	const closeEditModal = () => {
		setCarToEdit(null);
	};

	useEffect(() => {
		// re load data after adding or editing a car
		getdata();
	}, [addModal, carToEdit]);

	// useEffect(() => {
	// 	if(localStorage.getItem('role') === 'admin'){
	// 		columns.push(adminAccess[0])
	// 		columns.push(adminAccess[1])
	// 	}
	// }, []);
	// delete request 
	const deleteCar = async (id: string) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${localStorage.getItem('token')}`
			}
		};
		try {
			const url = `http://localhost:8080/api/cars/deleteCar/${id}`;
			await axios.delete(url, config);
			getdata();
		} catch (error: any) {
			if (error.response && error.response.status === 403) {
				localStorage.removeItem('token')
				localStorage.removeItem('role')
				navigate('/login')
			}
			alert(error.response.data.message);
		}
	};
	const columns = [
		{
			name: 'Registration Number',
			selector: (row: Car) => row.registrationNumber,
			sortable: true,
		},
		{
			name: 'Model',
			selector: (row: Car) => row.model,
			sortable: true,
		},
		{
			name: 'Manufacturer',
			selector: (row: Car) => row.manufacturer,
			sortable: true,
		},
		{
			name: 'Category',
			selector: (row: Car) => row.category,
			sortable: true,
			style: { color: 'blue' }
		},
		{
			name: 'Color',
			selector: (row: Car) => row.color.join(', '),
			sortable: true,
		},
		{
			name: 'Make',
			selector: (row: Car) => row.make,
			sortable: true,
		},
		{
			name: 'Power',
			selector: (row: Car) => row.power,
			sortable: true,
		},
		{
			// edit button
			name: 'Edit',
			cell: (row: Car) => (
				<button
					onClick={() => {
						setCarToEdit(row);
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
			cell: (row: Car) =>
			(
				<button
					className={styles.delete_btn}
					onClick={() => deleteCar(row?._id ?? '')}
					disabled={localStorage.getItem('role') === 'admin' ? false : true}
				>
					<MdDelete />
				</button>
			),
			button: true,
		}

	]

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
				{carsData.length > 0 ? <div className={styles.data_table}>
					<DataTable
						pagination
						columns={columns}
						data={[...carsData].reverse()}
					/>
				</div> : <h3 style={{ textAlign: 'center' }}>No Cars Found</h3>}
			</div>
			<Modal
				isOpen={addModal}
				onRequestClose={closeAddModal}
				style={customStyles}
				contentLabel='Add Car Modal'
			>
				<Form carData={null} closeModal={closeAddModal} modalType='add' />
			</Modal>
			<Modal
				isOpen={carToEdit !== undefined && carToEdit !== null ? true : false}
				onRequestClose={closeEditModal}
				style={customStyles}
				contentLabel='Edit Car Modal'
			>
				<Form
					closeModal={closeEditModal}
					carData={carToEdit}
					modalType='edit'
				/>
			</Modal>
		</div>
	);

}
export default Home;