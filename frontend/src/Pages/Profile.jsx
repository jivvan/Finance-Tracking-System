import { Avatar, Badge, Button, Card } from "flowbite-react";
import QuickCreate from "../Components/QuickCreate";
import { useStore } from "../lib/utils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const profileDetails = useStore((state) => state.profile);
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <main className="p-4">
      <QuickCreate />
      <Card>
        <h1 className="text-2xl font-bold">Profile</h1>

        <div className="flex flex-col items-center space-y-4">
          <Avatar img="/user.png" rounded={true} size="xl" alt="User Avatar" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {profileDetails.username || "Username"}
          </h2>
          <Badge color="info">
            {"User ID: " + profileDetails.id || "User ID"}
          </Badge>
          <p className="text-gray-600 dark:text-gray-400">
            {profileDetails.email || "user@example.com"}
          </p>
          <div className="flex p-4 space-x-4">
            {/* <Button color="info" size="sm" outline>
              Change Password
            </Button> */}
            <Button onClick={signOut} color="failure" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default Profile;
