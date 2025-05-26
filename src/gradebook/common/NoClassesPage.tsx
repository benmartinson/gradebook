import GradebookPage from "../GradebookPage";
import Navbar from "../nav/Navbar";

const NoClassesPage = () => {
  return (
    <GradebookPage emptySidebar>
      <div className="w-full h-full overflow-hidden flex flex-col pb-4">
        <Navbar />
        <div className="flex flex-col items-center pt-20 h-full">
          <h1 className="text-2xl font-bold">No classes found</h1>
          <p className="text-gray-500">
            Please contact your administrator to get access to a class.
          </p>
        </div>
      </div>
    </GradebookPage>
  );
};

export default NoClassesPage;
