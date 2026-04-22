import { Router } from "express";
import { contractController } from "./contract.controller";
import { upload } from "../../middleware/upload";

const router= Router();

router.post("/create-contract", upload.single("file") ,contractController.contractAnalysis);

export const contractRoutes = router;