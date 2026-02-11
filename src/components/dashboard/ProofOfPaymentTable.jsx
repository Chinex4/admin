import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	setProofs,
	deleteProof,
	setSelectedImage,
} from '../../slices/proofSlice';
import ProofImageModal from '../modals/ProofImageModal';

const dummyProofs = [
	{
		id: 4,
		userName: 'fname lname',
		proof: 'https://via.placeholder.com/150', // Replace with real image URLs
		transId: '4mBENzhwPq',
		date: '2025-05-15T22:33:14.297Z',
	},
];

const ProofOfPaymentTable = () => {
	const dispatch = useDispatch();
	const { proofs } = useSelector((state) => state.proofs);
	const [search, setSearch] = useState('');

	useEffect(() => {
		dispatch(setProofs(dummyProofs));
	}, [dispatch]);

	const filtered = proofs.filter((proof) =>
		Object.values(proof).some((val) =>
			String(val).toLowerCase().includes(search.toLowerCase())
		)
	);

	return (
		<div className='mt-6 panel panel-pad'>
			<h2 className='text-xl font-semibold text-white mb-4'>
				Proof of Payment
			</h2>
			<input
				type='text'
				placeholder='Search proof...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='input-dark mb-4'
			/>

			<div className='table-wrap scrollbar-hide'>
				<table className='table-base'>
					<thead className='table-head'>
						<tr>
							<th className='px-3 py-2'>#</th>
							<th className='px-3 py-2'>User Name</th>
							<th className='px-3 py-2'>Proof of Payment</th>
							<th className='px-3 py-2'>Transaction ID</th>
							<th className='px-3 py-2'>Date</th>
							<th className='px-3 py-2'>Action</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((proof, idx) => (
							<tr
								key={proof.id}
								className='table-row'>
								<td className='px-3 py-2'>{idx + 1}</td>
								<td className='px-3 py-2'>{proof.userName}</td>
								<td className='px-3 py-2'>
									<img
										src={proof.proof}
										alt='proof'
										onClick={() => dispatch(setSelectedImage(proof.proof))}
										className='w-16 h-16 rounded cursor-pointer hover:scale-105 transition'
									/>
								</td>
								<td className='px-3 py-2'>{proof.transId}</td>
								<td className='px-3 py-2'>
									{new Date(proof.date).toLocaleString()}
								</td>
								<td className='px-3 py-2'>
									<button
										className='bg-red-600 px-3 py-1 rounded text-sm'
										onClick={() => dispatch(deleteProof(proof.id))}>
										Delete Proof
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<ProofImageModal />
		</div>
	);
};

export default ProofOfPaymentTable;


