import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useTheme } from "../stores/themeStores";
import { NavLink, useNavigate } from "react-router";

const Setting = () => {
  const { email, setEmail, setPassword, clearToken } = useAuthStore();
  const { isDarkModeOn, toggleDarkMode } = useTheme();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailMsg, setEmailMsg] = useState("");
  const navigate = useNavigate();
  const [passMsg, setPassMsg] = useState("");

  const handleEmailChange = () => {
    if (!newEmail.includes("@")) {
      setEmailMsg("Please enter a valid email address.");
      return;
    }
    setEmail(newEmail);
    setNewEmail("");
    setShowEmailForm(false);
    setEmailMsg("Email updated.");
    setTimeout(() => setEmailMsg(""), 3000);
  };


  const handlePasswordChange = () => {
    const storedPassword = useAuthStore.getState().password;
    if (currentPassword !== storedPassword) {
      setPassMsg("Current password is incorrect.");
      return;
    }
    if (newPassword.length < 6) {
      setPassMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg("Passwords do not match.");
      return;
    }
    setPassword(newPassword);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
    setPassMsg("Password updated.");
    setTimeout(() => setPassMsg(""), 3000);
  };

  return (
    <div className="w-full mx-auto min-h-screen p-6">
      <h1 className="text-2xl font-medium mb-6">Settings</h1>

      {/* Appearance */}
      <section className="mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 px-1">
          Appearance
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            
            <div className="flex-1">
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${
                isDarkModeOn ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                  isDarkModeOn ? "left-[21px]" : "left-[3px]"
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 px-1">
          Account
        </p>
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/40 overflow-hidden divide-y divide-gray-200 dark:divide-gray-700/40">

          {/* Email */}
          <div>
            <button
              onClick={() => {
                setShowEmailForm((p) => !p);
                setShowPasswordForm(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-300/40 transition-colors"
            >
              
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Email address</p>
                <p className="text-xs text-gray-400">{email || "Not yet set"}</p>
              </div>
              <span className="text-gray-400 text-sm">›</span>
            </button>

            {showEmailForm && (
              <div className="px-5 pb-4 flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleEmailChange}
                  className="self-end text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Save
                </button>
                {emailMsg && (
                  <p className="text-xs text-green-500">{emailMsg}</p>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <button
              onClick={() => {
                setShowPasswordForm((p) => !p);
                setShowEmailForm(false);
              }}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-300/40 transition-colors"
            >
              
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-gray-400">Change your password</p>
              </div>
              <span className="text-gray-400 text-sm">›</span>
            </button>

            {showPasswordForm && (
              <div className="px-5 pb-4 flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  onClick={handlePasswordChange}
                  className="self-end text-sm bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-lg transition-colors"
                >
                  Update
                </button>
                {passMsg && (
                  <p className={`text-xs ${passMsg.includes("incorrect") || passMsg.includes("do not match") || passMsg.includes("at least 6 characters") ? "text-red-500" : "text-green-500"}`}>
                    {passMsg}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Session */}
      <section>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 px-1">
          Session
        </p>
        <div className="rounded-t-xl border-gray-200 dark:border-gray-700/40 hover:border-gray-700/50 border border-gray-200  overflow-hidden">
          <button
            onClick={clearToken}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-600/40   transition-colors"
          >
            
            <p className="text-sm font-medium">Log out</p>
          </button>
        </div>
        <div className="rounded-b-xl border-x-1 border-b-1 border-gray-200 dark:border-gray-700/40 hover:border-gray-700/50 overflow-hidden">
          <button
          onClick={() => navigate('/help')}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-600/40 transition-colors"
          >
            
            <NavLink to={'/help'} className="text-sm font-medium ">Help</NavLink>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Setting;