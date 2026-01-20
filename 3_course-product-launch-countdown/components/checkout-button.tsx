"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";

interface CheckoutButtonProps {
  planId: string;
  variant?: "default" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ 
  planId, 
  variant = "default", 
  className, 
  children 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("launchSettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.pricing && settings.pricing[planId]) {
          setPrice(settings.pricing[planId].launchPrice);
        }
      } catch (e) {
        console.error("Error loading price:", e);
      }
    }
  }, [planId]);

  const handleCheckout = async () => {
    setLoading(true);
    
    const formData = new FormData();
    formData.set("productId", planId);
    if (price) {
      formData.set("price", price.toString());
    }
    
    const result = await createCheckoutSession(formData);
    
    if (result?.error) {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children || "Get Started"
      )}
    </Button>
  );
}
