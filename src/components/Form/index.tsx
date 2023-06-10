import styles from './styles.module.css';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Makes, availableCars } from '../utils/availableCars';
import axios from 'axios';
import { Category } from '../CategoriesForm';
import {useNavigate} from 'react-router-dom'

interface CarData {
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

interface MainProps {
	closeModal: () => void;
	carData: CarData | null;
	modalType: 'add' | 'edit';
}

const Main: React.FC<MainProps> = ({ closeModal, carData, modalType }) => {
	const navigate = useNavigate()
	// preloaded data for form
	const [formData, setFormData] = useState<CarData>({
		model: carData?.model || 'Camry',
		manufacturer: carData?.manufacturer || 'Toyota',
		category: carData?.category || '',
		color: carData?.color || ['White'],
		make: carData?.make || '2000',
		power: carData?.power || '',
		registrationNumber: carData?.registrationNumber || '',
		desc: carData?.desc || '',
	});
	const [categories, setCategories] = useState<Category[]>([])
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
			console.log(error.message)
			// alert(error.message);
		}
	};

	useEffect(() => {
		getCategories()
	}, [])
	// error to show
	const [error, setError] = useState<string>('');

	// change color and model on changing the manufacturer
	const setManufacturer = (e: ChangeEvent<HTMLSelectElement>) => {
		const model = Object.keys(availableCars[e.target.value].Modals)[0];
		const color = availableCars[e.target.value].Modals[model].Colors[0];
		setFormData((preval) => ({
			...preval,
			manufacturer: e.target.value,
			model,
			color: [color],
		}));
	};

	// load colors for each model
	const setModal = (e: ChangeEvent<HTMLSelectElement>) => {
		const color = availableCars[formData.manufacturer].Modals[e.target.value].Colors;
		setFormData((preval) => ({
			...preval,
			model: e.target.value, // Remove the square brackets around 'model'
			color: color, // Remove the square brackets around 'color'
		}));
	};

	const setPower = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === '') {
			// prevent NaN value
			setFormData((preval) => ({
				...preval,
				power: '0',
			}));
		} else if (!isNaN(Number(value))) {
			if (value.length < 10) {
				// prevent infinity value
				setFormData((preval) => ({
					...preval,
					power: value,
				}));
			}
		}
	};

	// set all other categories
	const setdata = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		// limit the length
		if (value.length > 0 && value.length < 20) {
			setFormData((preval) => ({
				...preval,
				[name]: value,
			}));
		} else {
			setFormData((preval) => ({
				...preval,
				[name]: '',
			}));
		}
	};
	const setColor = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData((preval) => ({
			...preval,
			color: [`${e.target.value}`],
		}));
	}
	const setCategory = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData((preval) => ({
			...preval,
			category: e.target.value,
		}));
	}

	const addCar = async (e: React.FormEvent) => {
		console.log('hitting')
		e.preventDefault();
		if (
			!formData.model ||
			!formData.manufacturer ||
			!formData.category ||
			!formData.color ||
			!formData.make ||
			!formData.power ||
			!formData.registrationNumber
		) {
			setError('Fill all Fields');
			return;
		}
		if (
			!(parseFloat(formData.power) > 699 && parseFloat(formData.power) < 10001)
		) {
			setError('Power value is not right');
			return;
		}
		const config = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${localStorage.getItem('token')}`
			}
		};

		try {
			const url = 'http://localhost:8080/api/cars/register';
			const res = await axios.post(url, formData, config);
			if (res.status === 200) alert('Device Added')
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


	// edit car request
	const editCar = async (e: FormEvent) => {
		e.preventDefault();
		if (
			!formData.model ||
			!formData.manufacturer ||
			!formData.category ||
			!formData.color ||
			!formData.make ||
			!formData.power ||
			!formData.registrationNumber
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
			const url = `http://localhost:8080/api/cars/updateCar/${carData?._id}`;
			const res = await axios.patch(url, formData, config);
			if (res.status === 200) alert('Device Updated')
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

	// form is same for adding and editing

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
				{modalType === 'add' ? 'Add Car' : 'Edit Car'}
			</h1>

			<div className={styles.login_container}>
				<div>
					<div className={styles.login_form_container}>
						<form className={styles.form_container}>
							<div className={styles.inner_form_elements}>
								<div className={styles.form_item}>
									<label htmlFor='exampleInputPassword1'>Registration Number: </label>
									<input
										className={styles.input}
										type='text'
										value={formData.registrationNumber}
										onChange={setdata}
										name='registrationNumber'
										id='exampleInputPassword1'
									/>
								</div>
								<div className={styles.form_item}>
									<label className='title'>Manufacturer Name: </label>
									<label>
										<select
											value={formData.manufacturer}
											onChange={(e) => setManufacturer(e)}
											className={styles.input}
											name='manufacturer'
										>
											{Object.keys(availableCars).map((m, index) => {
												return (
													<option key={index} value={m}>
														{m}
													</option>
												);
											})}
										</select>
									</label>
								</div>

								<div className={styles.form_item}>
									<label style={{ color: 'blue' }} className='title'>Category: </label>
									<label>
										<select
											style={{ color: 'blue' }}
											value={formData.category}
											onChange={(e) => setCategory(e)}
											className={styles.input}
											name='manufacturer'
										>
											<option value=''>Select</option>
											{categories.map((m, index) => {
												return (
													<option key={index} value={m.name}>
														{m.name}
													</option>
												);
											})}
										</select>
									</label>
								</div>
							</div>

							<div className={styles.inner_form_elements}>
								<div className={styles.form_item}>
									<label className='title'>Model: </label>
									<label>
										<select
											value={formData.model}
											onChange={(e) => setModal(e)}
											className={styles.input}
											name='model'
										>
											{formData.manufacturer !== '' && Object.keys(availableCars[formData.manufacturer].Modals).map(
												(m: string, index) => {
													return (
														<option key={index} value={m}>
															{m}
														</option>
													);
												}
											)}
										</select>
									</label>
								</div>

								<div className={styles.form_item}>
									<label className='title'>Color: </label>
									<label>
										<select
											value={formData.color}
											onChange={(e) => setColor(e)}
											className={styles.input}
											name='color'
										>
											{availableCars[formData.manufacturer].Modals[
												formData.model
											].Colors.map((m: string, index: number) => {
												return (
													<option key={index} value={m}>
														{m}
													</option>
												);
											})}
										</select>
									</label>
								</div>
							</div>
							<div className={styles.inner_form_elements}>
								<div className={styles.form_item}>
									<label className='title'>Make: </label>
									<label>
										<select
											value={formData.make}
											onChange={(e) => setdata(e)}
											className={styles.input}
											name='make'
											placeholder='Choose Category'
										>
											{Makes.map((m: any, index: number) => {
												return (
													<option key={index} value={m}>
														{m}
													</option>
												);
											})}
										</select>
									</label>
								</div>
								<div className={styles.form_item}>
									<label htmlFor='exampleInputPassword1'>Power cc (700 - 10000): </label>
									<input
										className={styles.input}
										type='text'
										value={formData.power}
										onChange={setPower}
										name='power'
										id='exampleInputPassword1'
									/>
								</div>
							</div>

							<div className={styles.form_item}>
								<label htmlFor='exampleInputPassword1'>Description: </label>
								<textarea
									name='desc'
									value={formData.desc}
									onChange={setdata}
									className={styles.input}
									id=''
									cols={30}
									rows={5}
								></textarea>
							</div>
						</form>
					</div>
				</div>
				{error && <div className={styles.error_msg}>{error}</div>}
				<button
					type='submit'
					onClick={modalType === 'add' ? addCar : editCar}
					className={styles.button_modal}
				>
					Submit
				</button>
			</div >
		</div>
	);
}
export default Main;
