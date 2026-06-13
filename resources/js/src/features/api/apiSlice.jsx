import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://www.mawthiq.tech/api";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            headers.set("Accept", "application/json");
            return headers;
        },
    }),
    tagTypes: ["User", "Permission", "Role", "TrainingProgram"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
        getProfile: builder.query({
            query: () => "/user",
            providesTags: ["User"],
        }),
        getUsers: builder.query({
            query: () => "/users",
            providesTags: ["User"],
        }),
        createUser: builder.mutation({
            query: (userData) => ({
                url: "/users",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: userData,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        toggleUserStatus: builder.mutation({
            query: (id) => ({
                url: `/users/${id}/toggle-status`,
                method: "PATCH",
            }),
            invalidatesTags: ["User"],
        }),
        bulkDeleteUsers: builder.mutation({
            query: (ids) => ({
                url: "/users/bulk-delete",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["User"],
        }),

        // Roles
        getRoles: builder.query({
            query: () => "/roles",
            providesTags: ["Role"],
        }),
        createRole: builder.mutation({
            query: (roleData) => ({
                url: "/roles",
                method: "POST",
                body: roleData,
            }),
            invalidatesTags: ["Role"],
        }),
        updateRole: builder.mutation({
            query: ({ id, ...roleData }) => ({
                url: `/roles/${id}`,
                method: "PUT",
                body: roleData,
            }),
            invalidatesTags: ["Role", "User"],
        }),
        deleteRole: builder.mutation({
            query: (id) => ({
                url: `/roles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        }),
        bulkDeleteRoles: builder.mutation({
            query: (ids) => ({
                url: "/roles/bulk-delete",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["Role"],
        }),

        // Permissions
        getPermissions: builder.query({
            query: () => "/permissions",
            providesTags: ["Permission"],
        }),
        createPermission: builder.mutation({
            query: (permissionData) => ({
                url: "/permissions",
                method: "POST",
                body: permissionData,
            }),
            invalidatesTags: ["Permission"],
        }),
        updatePermission: builder.mutation({
            query: ({ id, ...permissionData }) => ({
                url: `/permissions/${id}`,
                method: "PUT",
                body: permissionData,
            }),
            invalidatesTags: ["Permission", "Role"],
        }),
        deletePermission: builder.mutation({
            query: (id) => ({
                url: `/permissions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Permission"],
        }),
        bulkDeletePermissions: builder.mutation({
            query: (ids) => ({
                url: "/permissions/bulk-delete",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: ["Permission"],
        }),
        // Training Programs
        getTrainingPrograms: builder.query({
            query: ({ category, search } = {}) => {
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (search) params.append("search", search);
                return {
                    url: `/training-programs${params.toString() ? `?${params.toString()}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["TrainingProgram"],
        }),
        getTrainingProgram: builder.query({
            query: (id) => `/training-programs/${id}`,
            providesTags: (result, error, id) => [
                { type: "TrainingProgram", id },
            ],
        }),
        createTrainingProgram: builder.mutation({
            query: (programData) => ({
                url: "/training-programs",
                method: "POST",
                body: programData,
            }),
            invalidatesTags: ["TrainingProgram"],
        }),
        updateTrainingProgram: builder.mutation({
            query: ({ id, ...programData }) => ({
                url: `/training-programs/${id}`,
                method: "PUT",
                body: programData,
            }),
            invalidatesTags: ["TrainingProgram"],
        }),
        deleteTrainingProgram: builder.mutation({
            query: (id) => ({
                url: `/training-programs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TrainingProgram"],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetProfileQuery,
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useToggleUserStatusMutation,
    useBulkDeleteUsersMutation,
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useBulkDeleteRolesMutation,
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
    useBulkDeletePermissionsMutation,
    useGetTrainingProgramsQuery,
    useGetTrainingProgramQuery,
    useCreateTrainingProgramMutation,
    useUpdateTrainingProgramMutation,
    useDeleteTrainingProgramMutation,
} = apiSlice;
