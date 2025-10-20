import { baseApi } from "@/redux/baseApi";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendParcel: builder.mutation({
      query: (parcelDetails) => ({
        url: "/parcels",
        method: "POST",
        data: parcelDetails,
      }),
      invalidatesTags: ["PARCELS"],
    }),
    getAllParcels: builder.query({
      query: () => ({
        url: "/parcels",
        method: "GET",
      }),
      providesTags: ["PARCELS"],
      transformResponse: (response) => response.data,
    }),
    trackParcel: builder.query({
      query: (trackingId: string) => ({
        url: `/parcels/track/${trackingId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    getMyParcels: builder.query({
      query: () => ({
        url: "/parcels/me",
        method: "GET",
      }),
      providesTags: ["PARCELS"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllParcelsQuery,
  useSendParcelMutation,
  useTrackParcelQuery,
  useLazyTrackParcelQuery,
  useGetMyParcelsQuery,
} = parcelApi;
