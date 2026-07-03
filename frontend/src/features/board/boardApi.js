import { apiSlice } from "../../app/api/apiSlice";

const boardApi = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getBoards:builder.query({
            query:()=>"/rooms/myrooms",
            providesTags:["Board"]
        }),
        createBoard:builder.mutation({
            query:(data)=>({
                url:"/rooms/create",
                method:"POST",
                body:data
            }),
            invalidatesTags:["Board"]
        }),
        renameBoard:builder.mutation({
            query:({id,title})=>({
                url:`/rooms/${id}`,
                method:"PATCH",
                body:{title}
            }),
            invalidatesTags:["Board"]
        }),
        deleteBoard:builder.mutation({
            query:(id)=>({
                url:`/rooms/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:["Board"]
        })
    })
});

export const {useGetBoardsQuery,useCreateBoardMutation,useRenameBoardMutation,useDeleteBoardMutation}=boardApi;