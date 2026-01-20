"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const DEFAULT_PRODUCTS = {
  starter: {
    name: "SciAI Assistant Starter",
    price: 2900, // $29 in cents
    description: "Perfect for individual researchers",
  },
  pro: {
    name: "SciAI Assistant Pro",
    price: 9900, // $99 in cents
    description: "For research teams and labs",
  },
  scale: {
    name: "SciAI Assistant Scale",
    price: 29900, // $299 in cents
    description: "For institutions and enterprises",
  },
};

export async function createCheckoutSession(formData: FormData) {
  const productId = formData.get("productId") as keyof typeof DEFAULT_PRODUCTS;
  const customPrice = formData.get("price") as string;

  if (!productId || !DEFAULT_PRODUCTS[productId]) {
    return { error: "Invalid product" };
  }

  const product = DEFAULT_PRODUCTS[productId];
  // Use custom price if provided (in cents), otherwise use default
  const priceInCents = customPrice ? parseInt(customPrice) * 100 : product.price;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: priceInCents,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      metadata: {
        productId,
      },
    });

    if (session.url) {
      redirect(session.url);
    }

    return { error: "Failed to create checkout session" };
  } catch (error: any) {
    // Don't catch Next.js redirect errors
    if (error?.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Stripe error:", error);
    const errorMessage = error?.message || "Something went wrong";
    return { error: errorMessage };
  }
}

export async function handleCheckoutSuccess(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const supabase = await createClient();
      
      // Record the purchase
      await supabase.from("purchases").insert({
        email: session.customer_email,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string,
        product_id: session.metadata?.productId,
        amount: session.amount_total,
        status: "completed",
      });

      // Mark waitlist subscriber as converted
      if (session.customer_email) {
        await supabase
          .from("waitlist")
          .update({ converted: true })
          .eq("email", session.customer_email.toLowerCase());
      }

      return { success: true, email: session.customer_email };
    }

    return { success: false };
  } catch (error) {
    console.error("Error processing checkout success:", error);
    return { success: false };
  }
}
