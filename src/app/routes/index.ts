import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";


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
    // {
    //     path:'/subscriptions',
    //     route:subscriptionRouter
    // },
    // {
    //     path:'/admin',
    //     route:adminRoutes
    // }
]


routes.forEach(route=>{
    router.use(route.path,route.route)
})

export default router