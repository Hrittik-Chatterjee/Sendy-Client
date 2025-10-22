import { baseApi } from "@/redux/baseApi";
import type {
  IResponse,
  IUser,
  IUpdateUser,
  IGetAllUsersResponse,
} from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<IGetAllUsersResponse, void>({
      query: () => ({
        url: "/user/all-users",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    updateUser: builder.mutation<
      IResponse<IUser>,
      { userId: string; payload: IUpdateUser }
    >({
      query: ({ userId, payload }) => ({
        url: `/user/${userId}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserMutation } = userApi;
