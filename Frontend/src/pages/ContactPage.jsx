import { MailIcon, PhoneIcon, MapPinIcon, MessageSquareIcon, HelpCircleIcon } from "lucide-react";
import { useState } from "react";

function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");

  const faqs = [
    {
      question: "What are your shipping options?",
      answer: "We offer standard, express, and same-day delivery options. Shipping costs vary based on location and delivery speed."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the tracking number sent to your phone, or visit our Track Order page and enter your order number."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 2-day return policy. Items must be unused and in original packaging. Return shipping is free for eligible items."
    },
    {
      question: "How do I cancel my order?",
      answer: "You can cancel your order within 24 hours of placement. Go to your order history and click 'Cancel Order' or contact customer support."
    },
    
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major E-birr, TeleBirr, mobile money, and bank transfers. We also offer installment payment options."
    },
    
    {
      question: "Can I change my delivery Goods?",
      answer: "Yes, you can change your delivery address within 24 hours of order placement by contacting customer support."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <MailIcon className="size-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Kaaralee qunamti</h1>
         
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8 justify-center bg-base-100 shadow-lg p-2">
          <a 
            className={`tab tab-lg ${activeTab === "contact" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            <PhoneIcon className="size-4 mr-2" />
            Kaaralee qunamti
          </a>
          <a 
            className={`tab tab-lg ${activeTab === "feedback" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("feedback")}
          >
            <MessageSquareIcon className="size-4 mr-2" />
            Qeeqa / Komi 
          </a>
          <a 
            className={`tab tab-lg ${activeTab === "faq" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <HelpCircleIcon className="size-4 mr-2" />
            Gaafilee irra dedebi gaafataman
          </a>
        </div>

        {/* Contact Info Tab */}
        {activeTab === "contact" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Kara erga gababaf</h2>
                <form className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Maqaa</span>
                    </label>
                    <input
                      type="text"
                      placeholder="maqaa keessan...."
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lakkoofsa bilbila</span>
                    </label>
                    <input
                      type="text"
                      placeholder="09 11 22 33 44 55"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Erga</span>
                    </label>
                    <textarea
                      placeholder="Erga keessan...."
                      className="textarea textarea-bordered w-full h-32"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Erga Ergi
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <PhoneIcon className="size-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Lakkoofsa bilbila</h3>
                      <p className="text-base-content/70">09 74  65 80 33</p>
                    </div>
                  </div>
                </div>
              </div>

               <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* TikTok Icon - Custom SVG */}
                    <svg className="size-6 text-primary mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-1">TikTok</h3>
                      <p className="text-base-content/70">chare74</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    {/* Telegram Icon - Custom SVG */}
                    <svg className="size-6 text-primary mt-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-1">Telegram</h3>
                      <p className="text-base-content/70">@chare74</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="size-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Iddon argama keenya</h3>
                        <p className="text-base-content/70 text-sm leading-relaxed">
                    Maagala Leeman daandii guudda irra<br/>
                    Naanawa agilgillooti
                  </p>   
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback / Complaint Tab */}
        {activeTab === "feedback" && (
          <div className="max-w-3xl mx-auto">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  <MessageSquareIcon className="size-6 text-primary" />
                  Share Your Feedback or Submit a Complaint
                </h2>
                <p className="text-base-content/70 mb-6">
                  Your feedback helps us improve. Whether it's a compliment, suggestion, or complaint, 
                  we value your input and will respond promptly.
                </p>

                <form className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Type</span>
                    </label>
                    <select className="select select-bordered w-full">
                      <option>Feedback</option>
                      <option>Complaint</option>
                      <option>Suggestion</option>
                      <option>Compliment</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">phone number</span>
                    </label>
                    <input
                      type="text"
                      placeholder="09 11 22 33 44 55"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Send your message</span>
                    </label>
                    <textarea
                      placeholder="Please provide detailed information..."
                      className="textarea textarea-bordered w-full h-40"
                    />
                  </div>

                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>We aim to respond to all feedback and complaints within 24-48 hours.</span>
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Submit Feedback
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <HelpCircleIcon className="size-16 mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
              <p className="text-base-content/70">
                Find quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="collapse collapse-plus bg-base-100 shadow-lg">
                  <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                  <div className="collapse-title text-lg font-medium">
                    {faq.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/70">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 p-6 bg-base-100 rounded-box shadow-lg">
              <p className="text-base-content/70 mb-4">
                Didn't find what you're looking for?
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setActiveTab("contact")}
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactPage;
