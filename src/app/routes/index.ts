import { Request, Response, Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { upload } from "../middleware/upload";
import { uploadToCloudinary } from "../utils/uploadFile";
import { subscriptionRouter } from "../modules/stripe/stripe.route";
import { supportRoutes } from "../modules/support/support.routes";
import { CloudinaryUploadResponse } from "../interface/Cloudinary.interface";
import { contractRoutes } from "../modules/contract/contract.routes";
import { chatRoutes } from "../modules/chat/chat.routes";

const router = Router();

const routes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/contract",
    route: contractRoutes,
  },
  {
    path: "/chat",
    route: chatRoutes,
  },
  {
    path: "/stripe",
    route: subscriptionRouter,
  },
  {
    path: "/support",
    route: supportRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

router.post(
  "/upload",
  upload.single("upload"),
  async (req: Request, res: Response) => {
    if (req.file) {
      // const protocol = req.protocol;
      // const host = req.get("host");
      // const result = uploadFile(req.file, { protocol, host });
      const result = (await uploadToCloudinary(
        req.file,
      )) as CloudinaryUploadResponse;
      console.log(result);
      if (result?.secure_url) {
        return res.status(200).json({ success: true, url: result.secure_url });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "No file provided" });
      }
      // result.then((response) => {
      //   console.log(response)
      //   if (response.success) {
      //     return res.status(200).json(response);
      //   } else {
      //     return res.status(400).json(response);
      //   }
      // });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "No file provided" });
    }
  },
);

export default router;
