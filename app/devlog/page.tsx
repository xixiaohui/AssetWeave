
// import { getAllDevlogs } from "@/lib/devlog";
// import Link from "next/link";
// import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

// export default function DevlogList() {
//   const posts = getAllDevlogs();

//   return (
//     <Box sx={{ p: 4, mt: 7 }}>
//       <Typography variant="h2" sx={{ mb: 4 }}>
//         开发记录
//       </Typography>

//       <Grid container spacing={3}>
//         {posts.map(post => (
//           <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.slug}>
//             <Link href={`/devlog/${post.slug}`} style={{ textDecoration: "none" }}>
//               <Card sx={{
//                 height: "100%",
//                 transition: "all 0.3s ease",
//                 borderRadius: 3,
//                 "&:hover": { boxShadow: 6, transform: "translateY(-6px)" }
//               }}>
//                 <CardContent>
//                   <Typography variant="h6" fontWeight={600}>{post.title}</Typography>
//                   <Typography variant="body2" color="text.secondary">{post.description}</Typography>
//                   <Typography variant="body2" color="text.secondary">{post.date}</Typography>
//                 </CardContent>
//               </Card>
//             </Link>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }


import { getAllDevlogs } from "@/lib/devlog"; // 纯服务端函数
import DevlogList from "./DevlogList"; // 前端分页组件

export default function Page() {
  const posts = getAllDevlogs(); // Server Component 可以直接用 fs

  return <DevlogList posts={posts} />;
}