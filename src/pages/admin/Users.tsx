import { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/user.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Users as UsersIcon,
  Edit,
  Search,
  CheckCircle2,
  XCircle,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";
import type { IUser, IUpdateUser, TRole } from "@/types";

const Users = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [editForm, setEditForm] = useState<IUpdateUser>({});

  const users = data?.data || [];
  const totalUsers = data?.meta?.total || 0;

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.roles.some((role) =>
        role.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      roles: user.roles,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isDeleted: user.isDeleted,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser({
        userId: selectedUser._id,
        payload: editForm,
      }).unwrap();

      toast.success("User updated successfully!");
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditForm({});
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to update user";
      toast.error(errorMessage);
    }
  };

  const getRoleBadgeColor = (role: TRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "ADMIN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "SENDER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "RECEIVER":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleRoleToggle = (role: TRole) => {
    const currentRoles = editForm.roles || selectedUser?.roles || [];
    const hasRole = currentRoles.includes(role);

    if (hasRole) {
      setEditForm({
        ...editForm,
        roles: currentRoles.filter((r) => r !== role),
      });
    } else {
      setEditForm({
        ...editForm,
        roles: [...currentRoles, role],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-primary" />
              Users Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all users and their permissions
            </p>
          </div>
          <Card className="w-fit">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              View and manage user information and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="py-12 text-center">
                <XCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                <p className="text-destructive">
                  Failed to load users. Please try again later.
                </p>
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="py-12 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No users found matching your search"
                        : "No users available"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Verified</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map((role) => (
                                  <Badge
                                    key={role}
                                    variant="outline"
                                    className={getRoleBadgeColor(role)}
                                  >
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.isActive === "ACTIVE" && !user.isDeleted ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.isVerified ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and permissions. Changes will be saved
              immediately.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    New Password (leave blank to keep current)
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={editForm.password || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Roles & Permissions
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {(
                    ["SUPER_ADMIN", "ADMIN", "SENDER", "RECEIVER"] as TRole[]
                  ).map((role) => (
                    <div
                      key={role}
                      className="flex items-center space-x-2 p-3 border rounded-lg"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={(
                          editForm.roles || selectedUser.roles
                        ).includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`role-${role}`}
                        className="flex-1 cursor-pointer"
                      >
                        {role.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Account Status
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="isActive">Active Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow user to access the system
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={
                        (editForm.isActive ?? selectedUser.isActive) === "ACTIVE"
                      }
                      onCheckedChange={(checked) =>
                        setEditForm({
                          ...editForm,
                          isActive: checked ? "ACTIVE" : "INACTIVE",
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="isVerified">Verification Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Mark email as verified
                      </p>
                    </div>
                    <Switch
                      id="isVerified"
                      checked={editForm.isVerified ?? selectedUser.isVerified}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, isVerified: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="isDeleted">Deleted Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Soft delete this user account
                      </p>
                    </div>
                    <Switch
                      id="isDeleted"
                      checked={editForm.isDeleted ?? selectedUser.isDeleted}
                      onCheckedChange={(checked) =>
                        setEditForm({ ...editForm, isDeleted: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
