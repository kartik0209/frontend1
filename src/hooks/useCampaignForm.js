import { useState } from "react";

export const useCampaignForm = () => {
  const [formState, setFormState] = useState({
    objective: "conversions",
    conversionTracking: "server_postback",
    revenueType: "fixed",
    status: "active",
    visibility: "public",
    enableTimeTargeting: false,
    enableScheduleStatus: false,
    duplicateClickAction: false,
    requireTerms: false,
    deepLink: true,
    enableSchedule: false,
    languages: ["English"],
    country: { name: "India", iso2: "IN" },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [modalState, setModalState] = useState({
    success: { open: false, title: "", message: "" },
    fail: { open: false, title: "", message: "" }
  });

 // Update the updateFormState function to handle both object and function updates
const updateFormState = (updates) => {
  setFormState((prevState) => {
    if (typeof updates === 'function') {
      return { ...prevState, ...updates(prevState) };
    }
    return { ...prevState, ...updates };
  });
};
  const resetFormState = () => {
    setFormState({
      objective: "conversions",
      conversionTracking: "server_postback",
      revenueType: "fixed",
      status: "active",
      visibility: "public",
      enableTimeTargeting: false,
      enableScheduleStatus: false,
      duplicateClickAction: false,
      requireTerms: false,
      deepLink: true,
      enableSchedule: false,
      languages: ["English"],
      country: { name: "India", iso2: "IN" },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  const showSuccessModal = (title, message) => {
    setModalState(prev => ({
      ...prev,
      success: { open: true, title, message }
    }));
  };

  const showFailModal = (title, message) => {
    setModalState(prev => ({
      ...prev,
      fail: { open: true, title, message }
    }));
  };

  const closeModals = () => {
    setModalState({
      success: { open: false, title: "", message: "" },
      fail: { open: false, title: "", message: "" }
    });
  };

  return {
    formState,
    updateFormState,
    resetFormState,
    modalState,
    showSuccessModal,
    showFailModal,
    closeModals
  };
};