import { ConfigProvider, Modal, notification } from "antd";
import React, { useState } from "react";
import { gifGenForPage, imageGenForPage, sdGetImage } from "../../api/aiAPI";
import "./style.css";

function DeleteModal({
	deleteModalVisible,
	setDeleteModalVisible,
	conflicts,
	setSelectedPage,
	handleDelete,
}) {
	return (
		<ConfigProvider
			theme={{
				components: {
					Modal: {
						contentBg: "#050012",
					},
				},
			}}
		>
			<Modal
				open={deleteModalVisible}
				footer={null}
				onCancel={() => setDeleteModalVisible(false)}
				centered
				closable={false}
			>
				<div className="font-bold text-2xl text-text-muted text-center">
					Delete This Page?
				</div>
				<div className="text-text-light text-md">
					Along with the current page and its steps, the following
					steps will be deleted:
				</div>
				<div
					id="taskList"
					className="overflow-y-scroll max-h-96 mb-2 mt-2"
				>
					{conflicts.map((conflict, index) => (
						<div
							key={index}
							className="flex p-1 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-600 mt-2 rounded-lg content-center items-center cursor-pointer"
							onClick={() => {
								setSelectedPage(conflict.page_number);
								setDeleteModalVisible(false);
							}}
						>
							<div className="text-text-light border-2 border-text-light p-2 rounded-lg w-12 h-12 text-center content-center font-semibold">
								{conflict.page_number}
							</div>
							<div className="text-text-light p-2 px-4 rounded-lg text-lg content-center font-semibold">
								{conflict.step_name} ({conflict.step_type}) [
								{conflict.step_number}]
							</div>
						</div>
					))}
				</div>
				<div className="flex justify-end gap-4">
					<div
						className="bg-slate-500 select-none p-1 px-4 font-semibold cursor-pointer hover:bg-slate-400 rounded-lg text-lg text-black"
						onClick={() => {
							setDeleteModalVisible(false);
						}}
					>
						Cancel
					</div>
					<div
						className="bg-red-600 select-none p-1 px-4 font-semibold cursor-pointer hover:bg-red-500 rounded-lg text-lg text-black"
						onClick={() => {
							setDeleteModalVisible(false);
							handleDelete();
						}}
					>
						Delete anyway
					</div>
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default DeleteModal;
