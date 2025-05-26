import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedImage } from '../../slices/proofSlice';

const ProofImageModal = () => {
	const dispatch = useDispatch();
	const { selectedImage } = useSelector((state) => state.proofs);

	return (
		<Transition
			appear
			show={!!selectedImage}
			as={Fragment}>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={() => dispatch(clearSelectedImage())}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					leave='ease-in duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-black bg-opacity-80' />
				</Transition.Child>
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						leave='ease-in duration-200'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'>
						<Dialog.Panel className='relative bg-[#111] rounded-lg p-4 shadow-xl max-w-2xl w-full'>
							<img
								src={selectedImage}
								alt='Proof of Payment'
								className='rounded-md max-h-[80vh] mx-auto'
							/>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default ProofImageModal;
