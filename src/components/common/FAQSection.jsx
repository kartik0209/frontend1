import React, { useState, useEffect } from "react";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import "../../styles/Faq.scss";

const faqData = [
  {
    question: "What is a performance marketing platform?",
    answer:
      "Compared to traditional advertising, performance marketing facilitates the measuring of results, efficiently. This enables advertisers to know the real value that they get from their ad spend. With a performance marketing platform, advertisers have the flexibility of targeting particular segments, as well as monitoring the achievement of campaigns, which enhances efficient usage of resources while catering to specific target audiences.",
  },
  {
    question: "What are some examples of performance marketing?",
    answer:
      "Performance marketing includes various strategies such as affiliate marketing, influencer partnerships, pay-per-click advertising, social media advertising, email marketing campaigns, and content marketing. Each of these methods focuses on measurable outcomes and ROI optimization.",
  },
  {
    question: "How does Trackier help improve campaign performance?",
    answer:
      "Trackier provides comprehensive analytics and real-time tracking that helps you identify high-performing campaigns, optimize underperforming ones, and make data-driven decisions. Our platform offers detailed insights into user behavior, conversion paths, and campaign effectiveness across multiple channels.",
  },
  {
    question: "How does Trackier help manage affiliate marketing programs?",
    answer:
      "Trackier streamlines affiliate program management by providing automated tracking, real-time reporting, fraud detection, and seamless integration with multiple affiliate networks. Our platform helps you recruit, onboard, and manage affiliates while ensuring accurate attribution and timely payouts.",
  },
  {
    question: "Can Trackier help with cross-device tracking?",
    answer:
      "Yes, Trackier offers advanced cross-device tracking capabilities that allow you to follow user journeys across multiple devices and platforms. This helps you understand the complete customer journey and attribute conversions accurately, regardless of the device used for the final conversion.",
  },
];

const FAQSection = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    setOpenFaqIndex(0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="faq-section" style={{ borderRadius: "80px 80px 0 0", display:"relative", top: "-65px"}}>
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked, Clearly Answered</h2>
          <p className="faq-subtitle">
            Find answers to the most common questions about our performance
            marketing platform and how it can help grow your business.
          </p>
        </div>

        <div className="faq-content">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFaqIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <h3 className="question-text">{faq.question}</h3>
                <span
                  className={`question-icon ${
                    openFaqIndex === index ? "active" : ""
                  }`}
                >
                  {openFaqIndex === index ? (
                    <MinusOutlined />
                  ) : (
                    <PlusOutlined />
                  )}
                </span>
              </div>

              <div
                className={`faq-answer ${
                  openFaqIndex === index ? "active" : ""
                }`}
              >
                {openFaqIndex === index && (
                  <div className="answer-content">
                    <p>{faq.answer}</p>
                    {faq.question.includes(
                      "performance marketing platform"
                    ) && (
                      <p>
                        Learn more about our{" "}
                        <a href="#platform" className="highlight-link">
                          performance marketing platform
                        </a>{" "}
                        and how it can transform your marketing strategy.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
