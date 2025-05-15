
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Lock, Save } from "lucide-react";
import { userService } from "@/services/userService";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedUser = await userService.updateUserProfile({
        username: profile.username,
        avatar: profile.avatar,
      });
      
      if (updatedUser) {
        updateUser(updatedUser);
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await userService.updateUserProfile({
        password: passwords.newPassword,
        currentPassword: passwords.currentPassword,
      });
      
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={profile.avatar} alt={profile.username} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(profile.username)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <div className="w-full">
                        <Input
                          id="avatar"
                          name="avatar"
                          className="mt-2"
                          placeholder="Avatar URL"
                          value={profile.avatar}
                          onChange={handleProfileChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter the URL for your profile image
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 w-full">
                      <p className="text-sm font-semibold">Role</p>
                      <p className="text-sm capitalize">{user?.role}</p>
                    </div>
                    
                    <div className="mt-4 w-full">
                      <p className="text-sm font-semibold">Member Since</p>
                      <p className="text-sm">{formatDate(user?.createdAt)}</p>
                    </div>
                    
                    <div className="mt-4 w-full">
                      <p className="text-sm font-semibold">Last Login</p>
                      <p className="text-sm">{formatDate(user?.lastLogin)}</p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid gap-4">
                        <div>
                          <label
                            className="text-sm font-medium"
                            htmlFor="username"
                          >
                            Username
                          </label>
                          <Input
                            id="username"
                            name="username"
                            value={profile.username}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium" htmlFor="email">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            disabled={true}
                          />
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          {isEditing ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                className="mr-2"
                                onClick={() => setIsEditing(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid gap-4">
                    <div>
                      <label
                        className="text-sm font-medium"
                        htmlFor="currentPassword"
                      >
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label
                        className="text-sm font-medium"
                        htmlFor="newPassword"
                      >
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label
                        className="text-sm font-medium"
                        htmlFor="confirmPassword"
                      >
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button type="submit">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
