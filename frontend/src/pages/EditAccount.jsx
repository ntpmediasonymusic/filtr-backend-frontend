import { useEffect, useState } from "react";
import EditAccountForm from "../components/ui/forms/EditAccountForm";

export default function EditAccount() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleSetUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-[50px] md:py-[50px]">
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-white text-2xl md:text-3xl font-bold">Mi cuenta</h2>
        <p className="text-[#CFDD28] font-semibold mt-2">{user.email}</p>
      </div>
      <EditAccountForm user={user} setUser={handleSetUser} />
    </div>
  );
}
