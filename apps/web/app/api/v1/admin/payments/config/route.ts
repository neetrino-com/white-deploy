import { NextRequest, NextResponse } from "next/server";
import { authenticateToken } from "@/lib/middleware/auth";
import { paymentConfigService } from "@/lib/services/payments/payment-config.service";

/**
 * GET /api/v1/admin/payments/config
 * Get payment configuration
 */
export async function GET(req: NextRequest) {
  try {
    console.log("📥 [ADMIN PAYMENTS CONFIG] GET request received");
    
    // Step 1: Authenticate user
    console.log("🔐 [ADMIN PAYMENTS CONFIG] Authenticating user...");
    let user;
    try {
      user = await authenticateToken(req);
    } catch (authError: any) {
      console.error("❌ [ADMIN PAYMENTS CONFIG] Authentication error:", authError);
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/authentication-error",
          title: "Authentication Error",
          status: 500,
          detail: authError.message || "Failed to authenticate user",
        },
        { status: 500 }
      );
    }
    
    if (!user) {
      console.log("❌ [ADMIN PAYMENTS CONFIG] No user found");
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/unauthorized",
          title: "Unauthorized",
          status: 401,
          detail: "Authentication token required",
        },
        { status: 401 }
      );
    }
    
    if (!user.roles?.includes("admin")) {
      console.log("❌ [ADMIN PAYMENTS CONFIG] User is not admin:", user.id);
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/unauthorized",
          title: "Unauthorized",
          status: 401,
          detail: "Admin access required",
        },
        { status: 401 }
      );
    }

    console.log("✅ [ADMIN PAYMENTS CONFIG] User authenticated:", user.id);
    
    // Step 2: Get configuration
    console.log("📋 [ADMIN PAYMENTS CONFIG] Fetching configuration...");
    let config;
    try {
      config = await paymentConfigService.getConfig();
      console.log("✅ [ADMIN PAYMENTS CONFIG] Configuration retrieved:", config ? "exists" : "null");
    } catch (configError: any) {
      console.error("❌ [ADMIN PAYMENTS CONFIG] Error getting config:", {
        message: configError.message,
        stack: configError.stack,
        type: configError.type,
        status: configError.status,
      });
      throw configError;
    }

    return NextResponse.json({ config });
  } catch (error: any) {
    console.error("❌ [ADMIN PAYMENTS CONFIG] Unexpected error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      type: error.type,
      status: error.status,
    });
    
    return NextResponse.json(
      {
        type: error.type || "https://api.shop.am/problems/internal-error",
        title: error.title || "Internal Server Error",
        status: error.status || 500,
        detail: error.detail || error.message || "An error occurred while retrieving payment configuration",
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/v1/admin/payments/config
 * Save payment configuration
 */
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    
    if (!user || !user.roles?.includes("admin")) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/unauthorized",
          title: "Unauthorized",
          status: 401,
          detail: "Admin access required",
        },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate configuration
    const validation = paymentConfigService.validateConfig(data);
    if (!validation.valid) {
      return NextResponse.json(
        {
          type: "https://api.shop.am/problems/validation-error",
          title: "Validation Error",
          status: 400,
          detail: validation.errors.join(", "),
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const config = await paymentConfigService.saveConfig(data);

    return NextResponse.json({ config }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [ADMIN PAYMENTS] Error saving config:", error);
    return NextResponse.json(
      {
        type: error.type || "https://api.shop.am/problems/internal-error",
        title: error.title || "Internal Server Error",
        status: error.status || 500,
        detail: error.detail || error.message || "An error occurred",
      },
      { status: error.status || 500 }
    );
  }
}









