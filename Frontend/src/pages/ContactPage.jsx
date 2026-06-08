import { MailIcon, PhoneIcon, MapPinIcon, MessageSquareIcon, HelpCircleIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const BASE_URL = 'http://localhost:3000';

function ContactPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/api/messages`, formData);
      setSubmitSuccess(true);
      setFormData({ name: "", phone: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Erga ergaa fayyadamaa jiru. Fayyadamiin deebiin yaadachi.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          
        </div>

        {/* Contact Info Tab */}
        {activeTab === "contact" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Kara erga gababaf</h2>
                {submitSuccess && (
                  <div className="alert alert-success mb-4">
                    <span>Erga keessan ergadheeraa! Fayyadamaan deebiin yaadachi.</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Maqaa</span>
                    </label>
                    <input
                      type="text"
                      placeholder="maqaa keessan galchaa...."
                      className="input input-bordered w-full"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lakkoofsa bilbila</span>
                    </label>
                    <input
                      type="text"
                      placeholder="lakkoofsa keessan bilbila galchaa...."
                      className="input input-bordered w-full"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Erga</span>
                    </label>
                    <textarea
                      placeholder="Erga keessan galchaa...."
                      className="textarea textarea-bordered w-full h-32"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : "Erga Ergaa"}
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
                      <h3 className="font-semibold mb-1">Lakkoofsa bilbila keenya</h3>
                      <p className="text-base-content/70">09 74  65 80 33 / 09 54 20 08 29</p>
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
                    naanawa agilgillooti cinati argamna.
                  </p>   
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        





      
        
      </div>
    </div>
  );
}

export default ContactPage;
