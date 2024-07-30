import { ConfigProvider, Modal, notification, Switch, Tooltip } from "antd";
import React, { useState } from "react";

function CommentModal({ commentModalVisible, setCommentModalVisible, story }) {
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
				open={commentModalVisible}
				footer={null}
				onCancel={() => setCommentModalVisible(false)}
				centered
				closable={false}
				width={"50%"}
			>
				<div className="text-white text-center">
					Implement Comment System here
				</div>
			</Modal>
		</ConfigProvider>
	);
}

export default CommentModal;
