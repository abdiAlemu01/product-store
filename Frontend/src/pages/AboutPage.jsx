import { InfoIcon } from "lucide-react";

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <InfoIcon className="size-16 mx-auto text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-base-content/70 mb-6">
          Learn more about our company and mission. This page is coming soon!
        </p>
        <div className="text-left space-y-4">
          <p className="text-base-content/80">
            ABDI/STOREGET is your trusted online shopping destination, offering a wide range of quality products at competitive prices.
          </p>
          <p className="text-base-content/80">
            We are committed to providing excellent customer service and a seamless shopping experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
