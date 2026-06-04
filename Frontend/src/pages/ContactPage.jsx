import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <MailIcon className="size-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-base-content/70">
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4">Send us a message</h2>
              <form className="space-y-4">
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
                    <span className="label-text">phone</span>
                  </label>
                  <input
                    type="number"
                    placeholder="09 11 22 33 44 55"
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Message</span>
                  </label>
                  <textarea
                    placeholder="Your message"
                    className="textarea textarea-bordered w-full h-32"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Send Message
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
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-base-content/70">09 11 22 33 44 55</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <MailIcon className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telegram</h3>
                    <p className="text-base-content/70">My telegram </p>
                  
                  </div>
                </div>
              </div>
            </div>.

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <MailIcon className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Tiktok</h3>
                    <p className="text-base-content/70">My Tiktok </p>
                  
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <MapPinIcon className="size-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-base-content/70">
                      Lemman on the streat around Agilgilot
                      <br />
                    
                     
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
