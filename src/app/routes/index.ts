import { Request, Response, Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { upload } from "../middleware/upload";
import { uploadFile } from "../utils/uploadFile";
import { subscriptionRouter } from "../modules/stripe/stripe.route";
import { supportRoutes } from "../modules/support/support.routes";


const router =Router();

const routes=[
    {
        path:'/user',
        route:userRoutes
    },
    {
        path:'/auth',
        route:authRoutes
    },
    // {
    //     path:'/products',
    //     route:productRoutes
    // },
    // {
    //     path:'/cart',
    //     route:cartRoutes
    // },
    // {
    //     path:'/address',
    //     route:addressRoutes
    // },
    // {
    //     path:'/orders',
    //     route:orderRoutes
    // },
    // {
    //     path:'/payments',
    //     route:paymentRoutes
    // },
    {
        path:'/stripe',
        route:subscriptionRouter
    },
    {
        path:'/support',
        route:supportRoutes
    }
]


routes.forEach(route=>{
    router.use(route.path,route.route)
})

router.post("/upload", upload.single("upload"), (req: Request, res: Response) => {
    console.log(req)
  if (req.file) {
    const protocol = req.protocol;
    const host = req.get("host");
    const result = uploadFile(req.file, { protocol, host });
    result.then((response) => {
      if (response.success) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    });
  } else {
    return res.status(400).json({ success: false, error: "No file provided" });
  }
});


export default router