import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FiSave } from "react-icons/fi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { AiOutlineUndo } from "react-icons/ai";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {
  fetchTheme,
  updateTheme,
  uploadLogos,
} from "../../store/slices/website_settingsSlice";

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
  const { theme, themeId, logos, loading, saving } = useSelector(
    (state) => state.settings
  );

  const [localTheme, setLocalTheme] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tempColor, setTempColor] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const [editingLogos, setEditingLogos] = useState(false);
  const [logoFiles, setLogoFiles] = useState({
    logo: null,
    logoDark: null,
    wordmark: null,
    wordmarkDark: null,
    lettermark: null,
    tagline: null,
  });
  const [wordmarkText, setWordmarkText] = useState({
    wordmark: "",
    wordmarkDark: "",
  });
  const [removedLogos, setRemovedLogos] = useState({});

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

    if (logos) {
      setWordmarkText({
        wordmark: logos.wordmarkText || "",
        wordmarkDark: logos.wordmarkDarkText || "",
      });
      setRemovedLogos({});
      setLogoFiles({
        logo: null,
        logoDark: null,
        wordmark: null,
        wordmarkDark: null,
        lettermark: null,
        tagline: null,
      });
    }
  }, [theme, logos]);

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
    if (!themeId) return toast.error("Theme ID not found!");
    dispatch(updateTheme({ id: themeId, data: localTheme }))
      .unwrap()
      .then(() => {
        toast.success("Theme saved successfully!");
        setHasChanges(false);
      })
      .catch((err) => toast.error(err));
  };

  const restoreTheme = () => {
    if (!themeId) return toast.error("Theme ID not found!");
    setLocalTheme(defaultTheme);
    Object.keys(defaultTheme).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, defaultTheme[key]);
    });
    dispatch(updateTheme({ id: themeId, data: defaultTheme }))
      .unwrap()
      .then(() => toast.success("Default theme restored and saved!"))
      .catch((err) => toast.error(err));
  };
  const handleLogoChange = (field, file) => {
    setLogoFiles((prev) => ({ ...prev, [field]: file }));
    if (file) {
      setWordmarkText((prev) => ({ ...prev, [field]: "" }));
      setRemovedLogos((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleWordmarkTextChange = (field, text) => {
    setWordmarkText((prev) => ({ ...prev, [field]: text }));
    if (text) setLogoFiles((prev) => ({ ...prev, [field]: null }));
  };

  // const handleDeleteLogo = (field) => {
  //   setLogoFiles((prev) => ({ ...prev, [field]: null }));
  //   setWordmarkText((prev) => ({ ...prev, [field]: "" }));
  //   setRemovedLogos((prev) => ({ ...prev, [field]: true }));
  // };

const saveLogos = async () => {
  if (!themeId) return toast.error("Theme ID not found!");

  const formData = new FormData();

  Object.keys(logoFiles).forEach((key) => {
    if (logoFiles[key]) formData.append(key, logoFiles[key]);
    if (removedLogos[key]) formData.append(`remove_${key}`, true);
  });

  if (wordmarkText.wordmark)
    formData.append("wordmarkText", wordmarkText.wordmark);

  if (wordmarkText.wordmarkDark)
    formData.append("wordmarkDarkText", wordmarkText.wordmarkDark);

  // DEBUG LOG
  console.log("------ FormData Payload ------");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  console.log("--------------------------------");

  try {
    await dispatch(uploadLogos({ id: themeId, files: formData })).unwrap();
    toast.success("Logos updated successfully!");

    setRemovedLogos({});
    setLogoFiles({
      logo: null,
      logoDark: null,
      wordmark: null,
      wordmarkDark: null,
      lettermark: null,
      tagline: null,
    });

    dispatch(fetchTheme());
  } catch (err) {
    toast.error(err.message || "Failed to update logos");
  }
};


  if (loading || !localTheme)
    return <p className="p-10 text-center">Loading theme...</p>;

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

  return (
    <div>
      <div className="bg-white rounded-2xl p-8 shadow-md relative space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-xl">Logo's Settings</h4>
            {/* {!editingLogos && (
              <button
                onClick={() => setEditingLogos(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500"
              >
                <AiTwotoneEdit className="w-5 h-5" />
              </button>
            )} */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "logo", label: "Logo", type: "image", required: true },
              {
                key: "logoDark",
                label: "Logo Dark",
                type: "image",
                required: false,
              },
              {
                key: "wordmark",
                label: "Wordmark",
                type: "image+text",
                required: true,
              },
              {
                key: "wordmarkDark",
                label: "Wordmark Dark",
                type: "image+text",
                required: false,
              },
              {
                key: "lettermark",
                label: "Lettermark",
                type: "image",
                required: false,
              },
              {
                key: "tagline",
                label: "Tagline",
                type: "image",
                required: false,
              },
            ].map(({ key, label, type, required }) => (
              <div
                key={key}
                className="p-5 border border-gray-300 rounded-lg bg-gray-50"
              >
                <h3 className="font-semibold text-[16px] mb-2">
                  {label} {required && <span className="text-red-600">*</span>}
                </h3>
                {type.includes("image") && (
                  <div className="mb-2 flex items-center gap-2">
                    {logos &&
                      logos[key] &&
                      !removedLogos[key] &&
                      !logoFiles[key] && (
                        <img
                          src={`${IMAGE_URL}${logos[key].replaceAll(
                            "\\",
                            "/"
                          )}`}
                          alt={label}
                          className="h-16"
                        />
                      )}
                    {logoFiles[key] && (
                      <img
                        src={URL.createObjectURL(logoFiles[key])}
                        alt={label}
                        className="h-16"
                      />
                    )}
                    {/* {editingLogos &&
                      ((logos[key] && !removedLogos[key]) ||
                        logoFiles[key]) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLogo(key)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <RiDeleteBin5Line />
                        </button>
                      )} */}
                    {/* {editingLogos && (
                      <input
                        type="file"
                        accept="image/*"
                        disabled={wordmarkText[key]}
                        onChange={(e) =>
                          handleLogoChange(key, e.target.files[0])
                        }
                      />
                    )} */}
                    <input
                      type="file"
                      className="w-full"
                      accept="image/*"
                      onChange={(e) => handleLogoChange(key, e.target.files[0])}
                    />
                  </div>
                )}
                {type.includes("text") && editingLogos && (
                  <input
                    type="text"
                    
                    placeholder="Enter text"
                    value={wordmarkText[key] || ""}
                    disabled={logoFiles[key]}
                    onChange={(e) =>
                      handleWordmarkTextChange(key, e.target.value)
                    }
                    className="border p-2 w-full rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {/* {editingLogos && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={saveLogos}
                className="px-6 py-3 bg-[#161925] text-white rounded-xl hover:bg-black transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditingLogos(false)}
                className="px-6 py-3 border rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          )} */}
          <button
            onClick={saveLogos}
            className="mt-4 px-6 py-3 bg-[#161925] text-white rounded-xl hover:bg-black transition w-full md:w-75"
          >
            Save Logos
          </button>
        </div>
        <div>
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() =>
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
                  if (result.isConfirmed) restoreTheme();
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161925] hover:bg-[#0d0f18] text-white transition w-full md:w-75"
            >
              <AiOutlineUndo className="w-5 h-5" />
              Default Theme
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

                  {editingKey !== key ? (
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
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        className="w-12 h-10 rounded"
                        value={tempColor}
                        onChange={(e) => setTempColor(e.target.value)}
                      />
                      <button
                        onClick={applyLocalChange}
                        className="text-green-600 px-2 hover:text-green-700 transition"
                      >
                        <IoCheckmarkDoneOutline className="text-2xl" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 px-2"
                      >
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
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
