import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RecaptchaRequest {
  token: string;
  action: string;
}

interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  errorCodes?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token, action } = (await req.json()) as RecaptchaRequest;

    if (!token) {
      console.error("Missing reCAPTCHA token");
      return new Response(
        JSON.stringify({ success: false, error: "Token não fornecido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const secretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Configuração inválida" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the token with Google's API
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const result = await response.json();

    console.log(`reCAPTCHA verification for action '${action}':`, {
      success: result.success,
      score: result.score,
      expectedAction: action,
      receivedAction: result.action,
      hostname: result.hostname,
    });

    // Check if verification was successful
    if (!result.success) {
      console.error("reCAPTCHA verification failed:", result["error-codes"]);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Verificação falhou",
          errorCodes: result["error-codes"],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check score (reCAPTCHA v3/Enterprise returns a score from 0.0 to 1.0)
    // Score >= 0.5 is generally considered safe
    const score = result.score ?? 1.0;
    const isHuman = score >= 0.5;

    if (!isHuman) {
      console.warn(`Low reCAPTCHA score for action '${action}': ${score}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Verificação de segurança falhou",
          score,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Optionally verify the action matches
    if (action && result.action && result.action !== action) {
      console.warn(
        `Action mismatch: expected '${action}', got '${result.action}'`
      );
      // Don't fail on action mismatch, just log it
    }

    return new Response(
      JSON.stringify({
        success: true,
        score,
        action: result.action,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno do servidor",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
