import { LayoutGridIcon } from "lucide-react";

function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <LayoutGridIcon className="size-16 mx-auto text-primary mb-6" />
        <h1 className="text-4xl font-bold mb-4">Categories</h1>
        <p className="text-lg text-base-content/70">
          Explore products by category. This page is coming soon!
        </p>
      </div>
    </div>
  );
}

export default CategoriesPage;
