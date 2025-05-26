import { useAdminAuth } from "./auth/useAdminAuth";
const AdminBadge = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  if (!isAdminAuthenticated) {
    return null;
  }
  return (
    <div className="absolute top-0 right-4">
      <div className="bg-orange-200  flex items-center text-orange-700 border border-t-0 h-5 text-xs border-orange-300 px-2 py-1 rounded-b-md">
        <div className="max-md:hidden">Logged in as&nbsp;</div>
        <div>Admin</div>
      </div>
    </div>
  );
};

export default AdminBadge;
