import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Style-specific prompts for targeted AI generation
const stylePrompts = {
  storybook: "Transform this drawing into a magical storybook illustration with soft, dreamy pastel colors, warm lighting, and enchanting fairy tale atmosphere. Use gentle watercolor-like tones with subtle gradients.",
  crayons: "Color this drawing with bold, vibrant crayon-like colors. Use bright primary and secondary colors with a slightly textured, waxy appearance typical of children's crayon artwork.",
  bold: "Apply high contrast, eye-catching colors to this drawing. Use bold, saturated colors with strong contrasts between light and dark areas for maximum visual impact.",
  fantasy: "Transform this into a magical fantasy world with shimmering, iridescent colors. Use mystical purples, blues, and pinks with magical sparkles and ethereal lighting effects.",
  surprise: "Color this drawing creatively with an unexpected and delightful color palette that would surprise and amaze. Use artistic color combinations that are visually stunning."
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { imageData, selectedStyle } = await req.json();

    // Check user credits
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creditsError) {
      console.error("Credits error:", creditsError);
      throw new Error("Failed to check user credits");
    }

    // Determine if this is a free attempt
    const isFreeAttempt = credits && credits.free_generations_remaining > 0;
    
    if (!isFreeAttempt && (!credits || credits.paid_credits <= 0)) {
      return new Response(
        JSON.stringify({ 
          error: "Insufficient credits",
          needsPayment: true,
          message: "You've used all your free generations. Purchase credits to continue."
        }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get style-specific prompt
    const stylePrompt = stylePrompts[selectedStyle as keyof typeof stylePrompts] || stylePrompts.surprise;

    // Create generation attempt record
    const { data: attempt, error: attemptError } = await supabaseClient
      .from("generation_attempts")
      .insert({
        user_id: user.id,
        selected_style: selectedStyle,
        prompt_used: stylePrompt,
        is_free_attempt: isFreeAttempt,
        cost: isFreeAttempt ? 0 : 2.00,
        status: "pending"
      })
      .select()
      .single();

    if (attemptError) {
      console.error("Attempt creation error:", attemptError);
      throw new Error("Failed to create generation attempt");
    }

    // Use OpenAI image generation for actual image processing
    const prompt = `${stylePrompt} Create a beautiful colored version of this uploaded drawing/coloring page.`;
    
    const openAIResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "high",
        output_format: "png"
      })
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API failed: ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    console.log("OpenAI response:", openAIData);
    
    if (!openAIData.data || !openAIData.data[0] || !openAIData.data[0].b64_json) {
      throw new Error("No image data returned from OpenAI");
    }
    
    const generatedImageUrl = `data:image/png;base64,${openAIData.data[0].b64_json}`;

    // Update generation attempt with success
    await supabaseClient
      .from("generation_attempts")
      .update({
        generated_image_url: generatedImageUrl,
        status: "completed"
      })
      .eq("id", attempt.id);

    // Update user credits
    if (isFreeAttempt) {
      await supabaseClient
        .from("user_credits")
        .update({
          free_generations_remaining: credits.free_generations_remaining - 1,
          total_generations: credits.total_generations + 1
        })
        .eq("user_id", user.id);
    } else {
      await supabaseClient
        .from("user_credits")
        .update({
          paid_credits: credits.paid_credits - 2.00,
          total_generations: credits.total_generations + 1
        })
        .eq("user_id", user.id);
    }

    return new Response(
      JSON.stringify({ 
        coloredImageUrl: generatedImageUrl,
        creditsUsed: isFreeAttempt ? 0 : 2.00,
        remainingFreeGenerations: isFreeAttempt ? credits.free_generations_remaining - 1 : credits.free_generations_remaining,
        remainingCredits: isFreeAttempt ? credits.paid_credits : credits.paid_credits - 2.00
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error in generate-colored-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});