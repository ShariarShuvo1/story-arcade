import React from "react";
import {ConfigProvider, Spin} from "antd";
import {Loading3QuartersOutlined} from "@ant-design/icons";

function LoadingFullscreen() {

    return (
        <ConfigProvider
            theme={{
                components: {
                    Spin: {
                        dotSizeLG: 128,
                    },
                },
            }}
        >
            <Spin
                indicator={<Loading3QuartersOutlined spin />}
                size="large"
                fullscreen
            />
        </ConfigProvider>
    );
}

export default LoadingFullscreen;
