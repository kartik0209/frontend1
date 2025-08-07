export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const getCountryIso2 = (countryObj) => {
  if (countryObj && typeof countryObj === "object" && countryObj.iso2) {
    return countryObj.iso2;
  }
  return "ALL";
};

export const buildPayload = (values, formState) => {
  const payload = {
    company_id: parseInt(values.companyId) || 1,
    objective: values.objective || "conversions",
    title: values.title || "Default Campaign",
    description: values.description || "",
    preview_url: values.previewUrl && isValidUrl(values.previewUrl) 
      ? values.previewUrl : undefined,
    defaultCampaignUrl: values.defaultCampaignUrl && isValidUrl(values.defaultCampaignUrl)
      ? values.defaultCampaignUrl : undefined,
    defaultLandingPageName: values.defaultLandingPageName || "Default",
    enableTimeTargeting: Boolean(formState.enableTimeTargeting),
    timezone: values.timezone || formState.timezone || "GMT+05:30",
    startHour: parseInt(values.startHour) || 0,
    endHour: parseInt(values.endHour) || 23,
    enableInactiveHours: false,
    activeDays: Array.isArray(values.targetingDays) ? values.targetingDays : [],
    uniqueClickSessionDuration: parseInt(values.uniqueClickSessionDuration) || 12,
    enableDuplicateClickAction: Boolean(formState.duplicateClickAction),
    duplicateClickAction: formState.duplicateClickAction ? "redirect_to_url" : "",
    enableCampaignSchedule: Boolean(values.enableCampaignSchedule || formState.enableSchedule),
    campaignStartDate: values.campaignStartDate ? values.campaignStartDate.toISOString() : "",
    campaignEndDate: values.campaignEndDate ? values.campaignEndDate.toISOString() : "",
    campaignStatus: values.campaignStatus || values.status || "active",
    enableScheduleStatusChange: Boolean(formState.enableScheduleStatus),
    statusToBeSet: values.statusToSet || "",
    scheduleDate: values.scheduleDate ? values.scheduleDate.toISOString() : "",
    enablePublisherEmailNotify: Boolean(values.publisherNotifyManual),
    publisherNotifyTime: values.publisherNotifyTime ? values.publisherNotifyTime.toISOString() : "",
    appName: values.appName || "",
    appId: values.appId || "",
    erid: values.erid || "",
    conversionFlow: values.conversionFlow || "",
    conversionFlowLanguages: Array.isArray(values.conversionFlowLanguages)
      ? values.conversionFlowLanguages : formState.languages || ["en"],
    unsubscribeUrl: values.unsubscribeUrl && isValidUrl(values.unsubscribeUrl)
      ? values.unsubscribeUrl : undefined,
    suppressionUrl: values.suppressionUrl && isValidUrl(values.suppressionUrl)
      ? values.suppressionUrl : undefined,
    enableDeepLink: Boolean(formState.deepLink),
    conversionHoldPeriod: parseInt(values.conversionHoldPeriod) || 0,
    conversionStatusAfterHold: values.conversionStatusAfterHold || "approved",
    revenueModel: values.revenueModel || "fixed",
    currency: values.currency || "USD",
    defaultGoalName: values.defaultGoalName || "Conversion",
    revenue: parseFloat(values.revenue) || 0,
    payout: parseFloat(values.payout) || 0,
    geoCoverage: Array.isArray(values.geoCoverage) ? values.geoCoverage.map(c => getCountryIso2(c))
      : formState.country ? [getCountryIso2(formState.country)] : ["IN"],
    category: Array.isArray(values.category) ? values.category 
      : values.category ? [values.category] : [],
    devices: Array.isArray(values.devices) ? values.devices
      : values.devices ? [values.devices] : ["ALL"],
    operatingSystem: Array.isArray(values.operatingSystem) ? values.operatingSystem
      : values.operatingSystem ? [values.operatingSystem] : ["ALL"],
    carrierTargeting: Array.isArray(values.carrierTargeting) ? values.carrierTargeting
      : values.carrierTargeting ? [values.carrierTargeting] : [],
    allowedTrafficChannels: Array.isArray(values.allowedTrafficChannels) 
      ? values.allowedTrafficChannels
      : values.allowedTrafficChannels ? [values.allowedTrafficChannels] : [],
    note: values.note || "",
    termsAndConditions: values.termsConditions || "",
    requireTermsAcceptance: Boolean(formState.requireTerms),
    conversionTracking: values.conversionTracking || "server_postback",
    primaryTrackingDomain: values.primaryTrackingDomain || undefined,
    status: values.status || "active",
    redirectType: values.redirectType || "302",
    visibility: values.visibility || "public",
    kpi: values.kpi || "",
    externalOfferId: values.externalOfferId || "",
    thumbnail: values.thumbnail || "",
    trackingDomain: values.primaryTrackingDomain || undefined,
    trackingSlug: values.title
      ? values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : "default-campaign",
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      if (value === "" || value === null || value === undefined) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    })
  );
};

export const validatePayload = (payload) => {
  const errors = [];
  
  if (!payload.title) errors.push("Title is required");
  if (!payload.company_id) errors.push("Company ID is required");
  if (!payload.defaultCampaignUrl) errors.push("Default Campaign URL is required");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const extractErrorMessage = (error) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const validationErrors = error.response.data.errors
      .map((err) => typeof err === "string" ? err : err.message || JSON.stringify(err))
      .join(", ");
    return `Validation errors: ${validationErrors}`;
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data) {
    return JSON.stringify(error.response.data);
  } else if (error.message) {
    return error.message;
  }
  return "Error creating campaign";
};