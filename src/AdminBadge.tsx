import { useAdminAuth } from "./auth/useAdminAuth";
const AdminBadge = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  if (!isAdminAuthenticated) {
    return null;
  }
  return (
    <div className="absolute top-0 right-4">
      <div className="bg-orange-200  flex items-center text-orange-700 border border-t-0 h-5 text-xs border-orange-300 px-2 py-1 rounded-b-md">
        Logged in as Admin
      </div>
    </div>
  );
};

export default AdminBadge;
