import { useState } from "react";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center">
      <h1>Navbar</h1>
      <div className="flex items-center gap-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
