import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiSave } from "react-icons/fi";
import { fetchTheme, updateTheme } from "../../store/slices/website_settingsSlice";
import { toast } from "react-toastify";
import { AiOutlineUndo } from "react-icons/ai";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const defaultTheme = {
  primary: "#2A4165",
  primarylight: "#F5F7FF",
  secondary: "#686868",
  dark: "#161925",
  accent: "#F8F9FD",
  background: "#FFFFFF",
  cardbg: "#23395B",
  navbarbg: "#161925",
  footerbg: "#161925",
  formsteps: "#27AE60",
};

const ThemeSettings = () => {
  const dispatch = useDispatch();
  const { theme, themeId, loading, saving } = useSelector(
    (state) => state.settings
  );

  const [editingKey, setEditingKey] = useState(null);
  const [tempColor, setTempColor] = useState("");
  const [localTheme, setLocalTheme] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const themeLabels = {
    primary: "Primary",
    primarylight: "Primary Light",
    secondary: "Secondary",
    dark: "Dark",
    accent: "Accent",
    background: "Background",
    cardbg: "Card Background",
    navbarbg: "Navbar Background",
    footerbg: "Footer Background",
    formsteps: "Form Steps",
  };

  useEffect(() => {
    dispatch(fetchTheme());
  }, [dispatch]);

  useEffect(() => {
    if (theme) {
      setLocalTheme(theme);
      Object.keys(theme).forEach((key) => {
        document.documentElement.style.setProperty(`--${key}`, theme[key]);
      });
    }
  }, [theme]);

  const startEdit = (key) => {
    setEditingKey(key);
    setTempColor(localTheme[key]);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setTempColor("");
  };

  const applyLocalChange = () => {
    const updated = { ...localTheme, [editingKey]: tempColor };
    setLocalTheme(updated);
    setEditingKey(null);
    setHasChanges(true);

    document.documentElement.style.setProperty(`--${editingKey}`, tempColor);
  };

  const resetAll = () => {
    setLocalTheme(theme);
    setHasChanges(false);

    Object.keys(theme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, theme[key]);
    });
  };

  const saveToServer = () => {
    if (!themeId) {
      toast.error("Theme ID not found!");
      return;
    }
    dispatch(updateTheme({ id: themeId, data: localTheme }))
      .unwrap()
      .then(() => {
        toast.success("Theme saved successfully!");
        setHasChanges(false);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const restoreTheme = () => {
    if (!themeId) {
      toast.error("Theme ID not found!");
      return;
    }

    setLocalTheme(defaultTheme);

    Object.keys(defaultTheme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, defaultTheme[key]);
    });

    dispatch(updateTheme({ id: themeId, data: defaultTheme }))
      .unwrap()
      .then(() => {
        toast.success("Default theme restored and saved!");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  if (loading || !localTheme) {
    return <p className="p-10 text-center">Loading theme...</p>;
  }

  return (
    <div>
      <div className="bg-white rounded-2xl p-8 shadow-md relative">
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "This will restore the default theme.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, restore",
                cancelButtonText: "Cancel",
                confirmButtonColor: "#161925",
                cancelButtonColor: "#d33",
              }).then((result) => {
                if (result.isConfirmed) {
                  restoreTheme();
                }
              });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161925] hover:bg-[#0d0f18] text-white transition"
          >
            <AiOutlineUndo className="w-5 h-5" />
            Restore
          </button>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <h4 className="font-bold text-xl">Theme Settings</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(themeLabels).map((key) => (
            <div
              key={key}
              className="p-5 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[16px]">
                    {themeLabels[key]}
                  </h3>
                  <p className="text-xs uppercase text-gray-500">{key}</p>
                </div>

                {editingKey !== key && (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border shadow-inner"
                      style={{ backgroundColor: localTheme[key] }}
                    />
                    <button
                      onClick={() => startEdit(key)}
                      className="p-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      <AiTwotoneEdit className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                )}

                {editingKey === key && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-12 h-10 rounded border"
                      value={tempColor}
                      onChange={(e) => setTempColor(e.target.value)}
                    />

                    <button
                      onClick={applyLocalChange}
                      className="text-green-600 px-2 hover:text-green-700 transition"
                    >
                      <IoCheckmarkDoneOutline className="text-2xl" />
                    </button>

                    <button onClick={cancelEdit} className="text-red-600 px-2">
                      <RiDeleteBin5Line className="text-xl" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {hasChanges && (
          <div className="mt-10 flex justify-between">
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-xl border hover:bg-gray-200"
            >
              Reset Changes
            </button>

            <button
              disabled={saving}
              onClick={saveToServer}
              className="px-8 py-3 bg-[#161925] text-white rounded-xl shadow-md hover:bg-black active:scale-95 transition disabled:opacity-50 flex items-center gap-2"
            >
              <FiSave className="text-lg" />
              {saving ? "Saving..." : "Save Theme"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSettings;
