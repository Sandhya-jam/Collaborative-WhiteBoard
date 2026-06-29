import { apiSlice } from "../../app/api/apiSlice";

export const authApi=apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        signup:builder.mutation({
            query:(userData)=>({
                url:"/auth/signup",
                method:"POST",
                body:userData
            }),
        }),
        login:builder.mutation({
            query:(credentials)=>({
                url:"/auth/login",
                method:"POST",
                body:credentials,
            })
        }),
    }),
});

export const {useSignupMutation,useLoginMutation}=authApi;