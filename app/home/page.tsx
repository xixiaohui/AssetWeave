// pages/index.tsx
"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const assetsMock = [
  { name: "RWA 房产一号", type: "Real Estate", price: 100, raised: 5000, max: 10000, status: "RAISING" },
  { name: "RWA 债券二号", type: "Bond", price: 50, raised: 2000, max: 5000, status: "RUNNING" },
  { name: "RWA 基建三号", type: "Infrastructure", price: 200, raised: 10000, max: 15000, status: "FINISHED" },
];

const kpiData = [
  { label: "总募集资金", value: "￥12,500,000" },
  { label: "成功项目数", value: "18" },
  { label: "累计分红", value: "￥1,240,000" },
  { label: "平均收益率", value: "8.7%" },
];

const partnerLogos = [
  "https://picsum.photos/seed/1/80",
  "https://picsum.photos/seed/2/80",
  "https://picsum.photos/seed/3/80",
  "https://picsum.photos/seed/4/80",
  "https://picsum.photos/seed/5/80",
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#fefefe", color: "#111" }}>
      {/* ===== Hero ===== */}
      <Box
        sx={{
          py: 16,
          textAlign: "center",
          background: "linear-gradient(135deg, #6B5BFF, #00CFFD)",
          color: "#fff",
          borderRadius: "0 0 80% 0 / 0 0 20% 0",
        }}
      >
        <Typography variant="h1" fontWeight={700} gutterBottom>
          Asset Weave
        </Typography>
        <Typography variant="h5" sx={{ maxWidth: 700, mx: "auto", mb: 6 }}>
          融合 Web2 + Web3 的 RWA 融资平台，透明、安全、分红可追踪
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
          <Button variant="contained" color="secondary" size="large">
            立即认购
          </Button>
          <Button variant="outlined" color="inherit" size="large">
            了解更多
          </Button>
        </Stack>

        {/* 数据亮点 */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          justifyContent="center"
          sx={{ mt: 10 }}
        >
          {kpiData.map((k, i) => (
            <Box key={i} sx={{ textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700}>
                {k.value}
              </Typography>
              <Typography variant="subtitle1" color="grey.200">
                {k.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
        
      {/* ===== 平台优势 ===== */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          平台优势
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" },
            gap: 4,
            mt: 4,
          }}
        >
          {[
            { title: "安全透明", desc: "资产和分红链上记录，审计可查", icon: "🛡️" },
            { title: "多资产支持", desc: "支持房产、债券、基建等多种资产", icon: "🏢" },
            { title: "灵活认购", desc: "多轮认购，最小认购门槛低", icon: "💰" },
            { title: "收益分红", desc: "按持仓比例实时分红", icon: "📈" },
            { title: "金融闭环", desc: "从认购到赎回全流程链上管理", icon: "🔗" },
            { title: "高端服务", desc: "专业团队支持，安全合规", icon: "👨‍💼" },
          ].map((f, i) => (
            <Card
              key={i}
              sx={{
                textAlign: "center",
                py: 5,
                px: 2,
                borderRadius: 4,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 12px 30px rgba(0,0,0,0.12)" },
              }}
            >
              <Typography variant="h3">{f.icon}</Typography>
              <Typography variant="h6" fontWeight={600} sx={{ my: 2 }}>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {f.desc}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ===== 融资流程 ===== */}
      <Container sx={{ py: 12, bgcolor: "#f7f8fa" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          融资流程
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" },
            gap: 4,
            mt: 4,
          }}
        >
          {[
            { step: "资产登记", desc: "管理员登记资产，上传资料，生成 tokenId 链上记录" },
            { step: "用户认购", desc: "通过 USDT/稳定币认购资产 token，支持 KYC 白名单" },
            { step: "启动资产", desc: "募集达到最小资金后，资产进入运行期，可注入收益" },
            { step: "领取分红", desc: "按持仓比例领取分红，链上记录透明" },
            { step: "赎回/结束", desc: "到期或完成赎回本金+收益，token 销毁" },
          ].map((p, i) => (
            <Card
              key={i}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
              }}
            >
              <Typography variant="h5" fontWeight={600} mb={1}>
                Step {i + 1}
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} mb={1}>
                {p.step}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {p.desc}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ===== 最新资产 ===== */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          最新资产
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" },
            gap: 4,
            mt: 4,
          }}
        >
          {assetsMock.map((a, i) => (
            <Card
              key={i}
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                transition: "0.3s",
                "&:hover": { boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {a.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  类型: {a.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  价格: {a.price} USDT
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  已募集: {a.raised} / {a.max}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  状态: {a.status}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button variant="contained" size="small">
                  认购
                </Button>
                <Button variant="outlined" size="small">
                  查看
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>

      {/* ===== 合作伙伴 & 投资人评价 ===== */}
      <Container sx={{ py: 12, bgcolor: "#f7f8fa" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          合作伙伴 & 投资人评价
        </Typography>
        <Stack direction="row" spacing={4} justifyContent="center" sx={{ flexWrap: "wrap", mt: 4 }}>
          {partnerLogos.map((url, i) => (
            <Avatar key={i} src={url} sx={{ width: 80, height: 80 }} />
          ))}
        </Stack>
        <Stack spacing={2} sx={{ mt: 6 }}>
          {[
            { name: "张先生", content: "Asset Weave 平台安全透明，投资体验极佳。" },
            { name: "李女士", content: "专业团队，分红准时，值得信赖。" },
          ].map((r, i) => (
            <Card key={i} sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
              <Typography fontWeight={600}>{r.name}</Typography>
              <Typography variant="body2" color="text.secondary">{r.content}</Typography>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* ===== FAQ ===== */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          常见问题
        </Typography>
        <Stack spacing={2} sx={{ mt: 4 }}>
          {[
            { q: "什么是 RWA？", a: "RWA 是真实世界资产，可以通过链上 Token 进行融资和分红。" },
            { q: "如何认购资产？", a: "通过连接钱包或账户选择资产，按最小认购金额购买对应 Token。" },
            { q: "分红什么时候到账？", a: "平台按比例注入收益，用户可实时领取分红。" },
            { q: "钱包连接安全吗？", a: "使用标准 Web3 钱包，资产和资金链上透明可查。" },
          ].map((faq, i) => (
            <Accordion key={i} sx={{ borderRadius: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>

      {/* ===== Footer ===== */}
      
    </Box>
  );
}
