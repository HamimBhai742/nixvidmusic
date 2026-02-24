import { Router } from "express";
import { subscriptionController } from "./stripe.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../interface/user.interface";

const router = Router();

router.post("/create-subscription", 
  // auth(),
subscriptionController.createPlanController);

router.get("/get-subscription",
  //  auth(),
    subscriptionController.getAllPlansController);

router.post("/purchase-subscription",
   checkAuth(Role.USER),
    subscriptionController.purchaseSubscriptionController);
    
router.post("/un-subscription",
   checkAuth(),
    subscriptionController.unsubscribeSubscriptionController);

export const subscriptionRouter = router;
