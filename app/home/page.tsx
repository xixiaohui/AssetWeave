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
import CountUp from "react-countup"; // 需要安装 react-countup: npm i react-countup
import HeroScreen from "@/components/home/HeroScreen";
import OnChainStats from "@/components/home/OnChainStats";
import FundFlow from "@/components/home/FundFlow";
import Architecture from "@/components/home/Architecture";
import ReturnBoard from "@/components/home/ReturnBoard";
import Compliance from "@/components/home/Compliance";

const assetsMock = [
  {
    name: "RWA 房产一号",
    type: "Real Estate",
    price: 100,
    raised: 5000,
    max: 10000,
    status: "RAISING",
  },
  {
    name: "RWA 债券二号",
    type: "Bond",
    price: 50,
    raised: 2000,
    max: 5000,
    status: "RUNNING",
  },
  {
    name: "RWA 基建三号",
    type: "Infrastructure",
    price: 200,
    raised: 10000,
    max: 15000,
    status: "FINISHED",
  },
];

const kpiData = [
  { label: "总募集资金", value: "￥12,500,000" },
  { label: "成功项目数", value: "18" },
  { label: "累计分红", value: "￥1,240,000" },
  { label: "平均收益率", value: "8.7%" },
];

const partnerLogos = [
  "https://picsum.photos/seed/201/80",
  "https://picsum.photos/seed/301/80",
  "https://picsum.photos/seed/400/80",
  "https://picsum.photos/seed/507/80",
  "https://picsum.photos/seed/608/80",
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: "#fefefe", color: "#111" }}>
      <HeroScreen />
      <OnChainStats />
      <FundFlow />
      <Architecture />
      <ReturnBoard />
      <Compliance />

      {/* ===== 平台优势 ===== */}
      <Container sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          平台优势
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
            },
            gap: 4,
            mt: 4,
          }}
        >
          {[
            {
              title: "安全透明",
              desc: "资产和分红链上记录，审计可查",
              icon: "🛡️",
            },
            {
              title: "多资产支持",
              desc: "支持房产、债券、基建等多种资产",
              icon: "🏢",
            },
            { title: "灵活认购", desc: "多轮认购，最小认购门槛低", icon: "💰" },
            { title: "收益分红", desc: "按持仓比例实时分红", icon: "📈" },
            {
              title: "金融闭环",
              desc: "从认购到赎回全流程链上管理",
              icon: "🔗",
            },
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
      <Container sx={{ py: 12, bgcolor: "#f7f8fa" ,borderRadius:5}}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          融资流程
        </Typography>
        <Typography variant="subtitle1">
          募集金额、认购比例、持仓分布，全部链上可查
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(5,1fr)",
            },
            gap: 4,
            mt: 4,
          }}
        >
          {[
            {
              step: "资产登记",
              desc: "管理员登记资产，上传资料，生成 tokenId 链上记录",
            },
            {
              step: "用户认购",
              desc: "通过 USDT/稳定币认购资产 token，支持 KYC 白名单",
            },
            {
              step: "启动资产",
              desc: "募集达到最小资金后，资产进入运行期，可注入收益",
            },
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
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
            },
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
              <CardActions
                sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
              >
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
      <Container sx={{ py: 12, bgcolor: "#f7f8fa" ,borderRadius:5}}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          合作伙伴 & 投资人评价
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          投资人无需依赖平台报表。所有权益、分红、持仓、销毁记录，均可通过区块链浏览器独立验证。
        </Typography>
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          sx={{ flexWrap: "wrap", mt: 4 }}
        >
          {partnerLogos.map((url, i) => (
            <Avatar key={i} src={url} sx={{ width: 80, height: 80 }} />
          ))}
        </Stack>
        <Stack spacing={2} sx={{ mt: 6 }}>
          {[
            {
              name: "张先生",
              content: "Asset Weave 平台安全透明，投资体验极佳。",
            },
            { name: "李女士", content: "专业团队，分红准时，值得信赖。" },
          ].map((r, i) => (
            <Card
              key={i}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <Typography fontWeight={600}>{r.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {r.content}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* ===== FAQ ===== */}
      {/* ===== 投资与合规 FAQ（进阶） ===== */}
      <Container sx={{ py: 12, }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          投资与合规常见问题
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 6, maxWidth: 900 }}>
          我们理解投资人最关心的不是功能，而是：资金是否安全、资产是否真实、收益是否可信、退出是否顺畅。
          以下问题，直击这些核心关切。
        </Typography>

        <Stack spacing={2}>
          {[
            {
              q: "资产是否真实存在？如何验证？",
              a: "所有 RWA 资产均经过线下尽调与法律文件备案，相关证明材料在 Web2 系统留存。同时资产映射为链上 tokenId，投资人与监管机构可交叉验证资产真实性。",
            },
            {
              q: "我的资金是打给平台吗？是否会被挪用？",
              a: "不会。认购资金直接进入智能合约地址，由合约逻辑托管。平台无法私自转移或挪用资金，所有流向可通过区块链浏览器实时查看。",
            },
            {
              q: "分红是人工计算还是自动执行？",
              a: "分红由智能合约按持仓比例自动计算。管理员仅负责注入收益，分配逻辑完全链上执行，不依赖人工操作。",
            },
            {
              q: "如果平台停止运营，我的资产怎么办？",
              a: "您的资产权益记录在区块链上，与平台服务器无关。即使平台离线，您仍可通过区块链浏览器或第三方工具验证持仓与领取分红。",
            },
            {
              q: "如何确保项目方不会卷款跑路？",
              a: "项目资金托管于智能合约，需达到最小募集额才能启动。项目运行期间，收益按周期注入，无法一次性提走资金。",
            },
            {
              q: "认购后可以转让 Token 吗？",
              a: "当前 RWA Token 为不可转让设计，确保合规与 KYC 管理，避免二级市场风险与监管问题。",
            },
            {
              q: "如何退出投资？",
              a: "资产到期后，投资人可通过赎回功能取回本金与累计收益，Token 将被销毁，链上记录完整可查。",
            },
            {
              q: "是否需要 KYC？为什么？",
              a: "是的。KYC 确保合规，防止非法资金进入，同时保护投资人与平台的法律安全。",
            },
            {
              q: "收益率是否有保证？",
              a: "RWA 投资属于真实资产投资，收益来源于真实经营或租金/利息收入，不承诺保本保收益，收益透明可追溯。",
            },
            {
              q: "我如何独立验证所有数据，而不依赖平台页面？",
              a: "所有募集金额、分红注入、持仓、销毁记录，均可通过区块链浏览器输入合约地址和 tokenId 独立验证。",
            },
          ].map((faq, i) => (
            <Accordion
              key={i}
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                "&:before": { display: "none" },
              }}
            >
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
