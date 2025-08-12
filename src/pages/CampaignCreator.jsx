import React, { useState } from "react";
import { Form, Card, Typography, message } from "antd";
import BasicDetailsSection from "../components/campaign/Campaigncreator/BasicDetailsSection";
import ConversionTrackingSection from "../components/campaign/Campaigncreator/ConversionTrackingSection";
import TargetingSection from "../components/campaign/Campaigncreator/TargetingSection";
import SchedulingSection from "../components/campaign/Campaigncreator/SchedulingSection";
import RevenueSection from "../components/campaign/Campaigncreator/RevenueSection";
import AdvancedSettingsSection from "../components/campaign/Campaigncreator/AdvancedSettingsSection";
import FormActions from "../components/campaign/Campaigncreator/FormActions";
// import { SuccessModal, FailModal } from "./components/Modals";
import { useCampaignForm } from "../hooks/useCampaignForm";
import { validatePayload, buildPayload, extractErrorMessage } from "../utils/campaighUtils";
import apiclient from "../services/apiServices";
import "../styles/CampaignCreator.scss";
import SuccessModal from "../components/model/SuccessModal";
import FailModal from "../components/model/FailModal";
import ToasterService from "../utils/toaster";
const { Title } = Typography;

const CampaignForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const {
    formState,
    updateFormState,
    resetFormState,
    modalState,
    showSuccessModal,
    showFailModal,
    closeModals
  } = useCampaignForm();

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      
      const payload = buildPayload(values, formState);
      const validationResult = validatePayload(payload);
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(", "));
      }

      console.log("Clean payload before API call:", payload);

      const response = await apiclient.post("/admin/campaign", payload);
      console.log("response", response);

      if (response.status === 200 || response.status === 201) {
        message.success("Campaign created successfully!");
        form.resetFields();
        resetFormState();
        showSuccessModal("Campaign Created", "Campaign created successfully!");
      } else {
        throw new Error(`API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
     const errorMessage = extractErrorMessage(error);
    ToasterService.error(errorMessage);
      showFailModal("Error Creating Campaign", errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


 const handleFinishFailed = (errorInfo) => {
  const firstError = errorInfo.errorFields[0];
  if (firstError) {
    ToasterService.error(`Please fill  ${firstError.name.join(' ')}`);
  }
};


  return (
    <div className="campaign-form">
      <Card className="campaign-form__container">
        <Title level={2} className="campaign-form__title">
          Create Campaign
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          className="campaign-form__form"
          // initialValues={{
          //   objective: "conversions",
          //   conversionTracking: "server_postback",
          //   revenueType: "fixed",
          //   status: "active",
          //   visibility: "public",
          //   redirectType: "302",
          //   currency: "INR",
          //   revenue: 5,
          //   payout: 2,
          //   defaultLandingPageName: "",
          //   deepLink: true,
          //   conversionStatusAfterHold: "approved",
          //   devices: ["ALL"],
          //   operatingSystem: "ALL",
          //   geoCoverage: ["ALL"],
          // }}
        >
          <BasicDetailsSection 
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <ConversionTrackingSection 
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <TargetingSection 
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <SchedulingSection 
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <RevenueSection 
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <AdvancedSettingsSection 
            form={form}
            formState={formState} 
            updateFormState={updateFormState} 
          />
          
          <FormActions loading={loading} form={form} />
        </Form>

        <SuccessModal 
          open={modalState.success.open}
          title={modalState.success.title}
          message={modalState.success.message}
          onClose={closeModals} 
        />
        
        <FailModal 
          open={modalState.fail.open}
          title={modalState.fail.title}
          message={modalState.fail.message}
          onOk={closeModals} 
        />
      </Card>
    </div>
  );
};

export default CampaignForm;