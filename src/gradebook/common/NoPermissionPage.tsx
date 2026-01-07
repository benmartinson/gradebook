import { FaLinkSlash } from "react-icons/fa6";

const EmptyPage = ({ message }: { message: string }) => {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col pb-4">
      <div className="flex flex-col items-center justify-center flex-1">
        <FaLinkSlash size={40} className="text-gray-400" />
        <p className="text-gray-500 mt-4">{message}</p>
      </div>
    </div>
  );
};

export default EmptyPage;
