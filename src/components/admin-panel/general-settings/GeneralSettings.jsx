import { useState, useEffect, useRef } from "react";
import UseAdminData from "../../../hooks/UseAdminData";
import AlertMessage from "../../alert-messages/AlertMessage";
import { FaSave, FaUndo } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import axios from "axios";
import "./general-settings.css";
import { generalSettingsData } from "../adminPanelData.jsx";

const GeneralSettings = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL || "https://api.shahrpitaj.ir";
  const { errors, setErrors, role, token } = UseAdminData();
  const [saveMsg, setSaveMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let timeoutID = useRef(null);
  const { getGeneralSettingsInfo, generalSettingsInfo } = UseAdminData();

  const [settings, setSettings] = useState({
    baseInfo: {
      siteName: "",
      siteDescription: "",
    },
    contactInfo: {
      phone: "",
      address: "",
    },
    socialMediaInfo: {
      instagram: "",
      whatsApp: "",
      telegram: "",
    },
    systemInfo: {
      maintenanceMode: false,
      allowOnlineReservation: true,
    },
  });

  const updateSettingsState = () => {
    if (generalSettingsInfo.length > 0) {
      const { baseInfo, contactInfo, socialMediaInfo, systemInfo } =
        generalSettingsInfo[0];
      setSettings({
        baseInfo: {
          siteName: baseInfo.siteName || "",
          siteDescription: baseInfo.siteDescription || "",
        },
        contactInfo: {
          phone: contactInfo.phone || "",
          address: contactInfo.address || "",
        },
        socialMediaInfo: {
          instagram: socialMediaInfo.instagram || "",
          whatsApp: socialMediaInfo.whatsApp || "",
          telegram: socialMediaInfo.telegram || "",
        },
        systemInfo: {
          maintenanceMode: systemInfo.maintenanceMode ?? false,
          allowOnlineReservation: systemInfo.allowOnlineReservation ?? true,
        },
      });
    }
  };

  const handleInputChange = (section, field, value, type = "text") => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: type === "checkbox" ? Boolean(value) : value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      if (!token || role !== "admin") return;

      setIsLoading(true);
      const res = await axios.put(
        `${baseUrl}/admin/update-general-settings`,
        { settings },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        await fetchData();
        setSaveMsg(
          res.status === 200
            ? "تنظیمات با موفقیت به‌روزرسانی شد ✅"
            : "تنظیمات جدید با موفقیت ذخیره شد ✅"
        );
        timeoutID.current = setTimeout(() => {
          setSaveMsg("");
        }, 3000);
      }
    } catch (error) {
      setErrors(error.response?.data?.message || "خطا در ذخیره تنظیمات ❌");
      timeoutID.current = setTimeout(() => {
        setErrors("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    updateSettingsState();
    setSaveMsg("تنظیمات با موفقیت بازنشانی شد ✅");
    timeoutID.current = setTimeout(() => {
      setSaveMsg("");
    }, 3000);
  };

  const fetchData = async () => {
    await getGeneralSettingsInfo();
  };

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        await fetchData();

        if (generalSettingsInfo?.length > 0) {
          updateSettingsState();
        }
      } catch (error) {
        console.error("Error initializing settings:", error);
        setErrors("خطا در بارگذاری تنظیمات");
      }
    };

    initializeSettings();

    return () => {
      if (timeoutID.current) clearTimeout(timeoutID.current);
    };
  }, []);

  useEffect(() => {
    if (generalSettingsInfo?.length > 0) {
      updateSettingsState();
    }
  }, [generalSettingsInfo]);

  return (
    <section className="panel-content general-settings">
      {errors && <AlertMessage type={"error"} message={errors} />}
      {saveMsg && <AlertMessage type={"success"} message={saveMsg} />}

      <div className="settings-header">
        <h4>
          <AiFillSetting className="header-icon" />
          مدیریت تنظیمات عمومی سایت
        </h4>
        <p>در این بخش می‌توانید تنظیمات کلی سایت را مدیریت کنید</p>
      </div>

      <div className="settings-container">
        {generalSettingsData.map((section, index) => {
          return (
            <div key={index} className="settings-section">
              <div className="settings-section-header">
                {section.icon}
                <h6>{section.title}</h6>
              </div>
              <div className="settings-grid">
                {section.inputsData.map((input, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`setting-item ${
                        input.type === "checkbox" && "checkbox-item"
                      }`}
                    >
                      <label htmlFor={input.inputDataKey}>
                        {input.inputLabel}
                      </label>
                      {input.type === "textarea" ? (
                        <textarea
                          value={settings[section.dataKey][input.inputDataKey]}
                          onChange={(e) =>
                            handleInputChange(
                              section.dataKey,
                              input.inputDataKey,
                              e.target.value
                            )
                          }
                          className="setting-textarea"
                          placeholder={input.placeholder}
                          rows={input.rows}
                        />
                      ) : (
                        <div className="setting-input-wrapper">
                          <input
                            id={input.inputDataKey}
                            type={input.type}
                            value={
                              input.type !== "checkbox"
                                ? settings[section.dataKey][input.inputDataKey]
                                : undefined
                            }
                            checked={
                              input.type === "checkbox"
                                ? Boolean(
                                    settings[section.dataKey][
                                      input.inputDataKey
                                    ]
                                  )
                                : undefined
                            }
                            onChange={(e) =>
                              handleInputChange(
                                section.dataKey,
                                input.inputDataKey,
                                input.type === "checkbox"
                                  ? e.target.checked
                                  : e.target.value,
                                input.type
                              )
                            }
                            className={input.className}
                            placeholder={input.placeholder}
                          />
                          {input.type === "checkbox" && (
                            <span className="checkmark"></span>
                          )}
                          {input.type === "color" && (
                            <span className="color-value">
                              {settings[section.dataKey][input.inputDataKey]}
                            </span>
                          )}
                          {input.description && (
                            <span className="checkbox-description">
                              {input.description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* دکمه‌های اقدام */}
        <div className="settings-actions">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="save-btn"
          >
            <FaSave />
            {isLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
          <button onClick={handleResetSettings} className="reset-btn">
            <FaUndo />
            بازنشانی تنظیمات
          </button>
        </div>
      </div>
    </section>
  );
};

export default GeneralSettings;
