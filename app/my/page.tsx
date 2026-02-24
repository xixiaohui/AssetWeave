"use client"

import { Box, Typography } from "@mui/material";
import { useWallets } from "@privy-io/react-auth";

export default function MyPage() {
    const { wallets } = useWallets();
    const address = wallets?.[0]?.address;
    return (
        <Box sx={{ p: 8 ,mt:7}}>
            <Typography variant="h4" fontWeight={700}>
                我的主页
            </Typography>
            <Typography sx={{ mt: 2 }}>
                这里是我的主页，展示个人信息、持仓、分红等内容。
            </Typography>
            <Typography sx={{ mt: 2 }}>
                我的钱包地址：{address ? address : "未连接钱包"}
            </Typography>

        </Box>
    );
}