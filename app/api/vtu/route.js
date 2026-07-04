import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { network, plan, price, phone, service, simulateFailover } = await req.json();
    
    // Read keys from environment
    const vtpassApiKey = process.env.VTPASS_API_KEY;
    const vtpassSecretKey = process.env.VTPASS_SECRET_KEY;
    const clubkonnectApiKey = process.env.CLUBKONNECT_API_KEY;
    const clubkonnectUserId = process.env.CLUBKONNECT_USER_ID;

    let log = [];
    let success = false;
    let selectedGateway = "";
    let txDetails = null;

    log.push(`[${new Date().toLocaleTimeString()}] System starting subscription delivery route...`);

    // STEP 1: Attempt VTpass (Gateway 1 / Primary)
    log.push(`[${new Date().toLocaleTimeString()}] Attempting connection to Primary Gateway (VTpass)...`);
    
    // Determine if we should fail VTpass for testing/fallback demonstration
    const forceFailVTpass = simulateFailover === true || (!vtpassApiKey && Math.random() < 0.5);

    if (vtpassApiKey && !forceFailVTpass) {
      try {
        const isSandbox = !process.env.VTPASS_LIVE_MODE || process.env.VTPASS_LIVE_MODE === "false";
        const url = isSandbox 
          ? "https://sandbox.vtpass.com/api/pay" 
          : "https://api-service.vtpass.com/api/pay";

        // Generate a standard VTpass request_id: YYYYMMDDHHII[random-digits]
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const timestampStr = `${year}${month}${day}${hours}${minutes}${seconds}`;
        const randomHex = Math.random().toString(36).substring(2, 10);
        const requestId = `${timestampStr}${randomHex}`;

        // Map network string to VTpass serviceID
        const networkLower = network.toLowerCase();
        let serviceID = "mtn-data";
        if (networkLower.includes("airtel")) serviceID = "airtel-data";
        else if (networkLower.includes("glo")) serviceID = "glo-data";
        else if (networkLower.includes("9mobile")) serviceID = "9mobile-data";

        // Map to simulated variation code
        let variation_code = plan.toLowerCase().replace(/\s+/g, "");

        const payload = {
          request_id: requestId,
          serviceID: serviceID,
          billersCode: phone,
          variation_code: variation_code,
          phone: phone,
          amount: parseFloat(price.replace(/[^\d.]/g, "")) || 0
        };

        log.push(`[${new Date().toLocaleTimeString()}] Payload formulated. RequestID: ${requestId}. POSTing to VTpass...`);
        
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": vtpassApiKey,
            "secret-key": vtpassSecretKey || ""
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data && (data.code === "000" || data.content?.transactions?.status === "delivered")) {
          success = true;
          selectedGateway = "VTpass (Primary)";
          txDetails = data;
          log.push(`[${new Date().toLocaleTimeString()}] Gateway 1 success: VTpass API delivered (code 000).`);
        } else {
          throw new Error(data.response_description || data.errorMessage || "VTpass returned failed status code");
        }
      } catch (err) {
        log.push(`[${new Date().toLocaleTimeString()}] ❌ Gateway 1 Failed: ${err.message}`);
      }
    } else {
      if (forceFailVTpass) {
        log.push(`[${new Date().toLocaleTimeString()}] ❌ Gateway 1: VTpass is currently down or simulated as offline (504 Gateway Timeout).`);
      } else {
        // Quick local fallback simulation if no credentials are configured
        success = true;
        selectedGateway = "VTpass (Sandbox Mode)";
        log.push(`[${new Date().toLocaleTimeString()}] Gateway 1: VTpass credentials not active. Defaulting to sandbox success.`);
      }
    }

    // STEP 2: AUTOMATIC FALLBACK/FAILOVER TO CLUBKONNECT (Gateway 2)
    if (!success) {
      log.push(`[${new Date().toLocaleTimeString()}] ⚠️ FAILOVER INITIATED: Secondary Gateway automatic activation...`);
      log.push(`[${new Date().toLocaleTimeString()}] Attempting connection to Secondary Gateway (Clubkonnect)...`);

      if (clubkonnectApiKey) {
        try {
          const networkLower = network.toLowerCase();
          let netCode = "MTN";
          if (networkLower.includes("airtel")) netCode = "Airtel";
          else if (networkLower.includes("glo")) netCode = "Glo";
          else if (networkLower.includes("9mobile")) netCode = "9mobile";

          const requestId = "CK-" + Date.now();
          const url = `https://www.clubkonnect.com/API/Sub.asp?UserID=${clubkonnectUserId}&APIKey=${clubkonnectApiKey}&MobileNetwork=${netCode}&DataPlan=${encodeURIComponent(plan)}&MobileNo=${phone}&RequestID=${requestId}`;
          
          log.push(`[${new Date().toLocaleTimeString()}] GET request routed to Clubkonnect: RequestID ${requestId}...`);

          const response = await fetch(url);
          const text = await response.text();
          
          if (text && (text.includes("ORDER_RECEIVED") || text.includes("SUCCESS") || text.includes("00"))) {
            success = true;
            selectedGateway = "Clubkonnect (Failover Backup)";
            log.push(`[${new Date().toLocaleTimeString()}] Gateway 2 success: Clubkonnect completed backup routing.`);
          } else {
            throw new Error(`Clubkonnect endpoint returned: ${text.substring(0, 100)}`);
          }
        } catch (err) {
          log.push(`[${new Date().toLocaleTimeString()}] ❌ Gateway 2 Failed: ${err.message}`);
        }
      } else {
        // Simulated secondary fallback success!
        success = true;
        selectedGateway = "Clubkonnect (Fallback Sandbox)";
        log.push(`[${new Date().toLocaleTimeString()}] Gateway 2: Clubkonnect credentials not configured. Defaulting to sandbox failover success.`);
      }
    }

    if (success) {
      log.push(`[${new Date().toLocaleTimeString()}] ✅ Transaction completely delivered through ${selectedGateway}!`);
      return NextResponse.json({
        success: true,
        gateway: selectedGateway,
        log: log,
        reference: "VTU-" + Math.floor(10000000 + Math.random() * 90000000),
        timestamp: new Date().toISOString()
      });
    } else {
      log.push(`[${new Date().toLocaleTimeString()}] ❌ ERROR: Both VTU gateways returned terminal service issues.`);
      return NextResponse.json({
        success: false,
        log: log,
        error: "All VTU API Gateways failed to deliver the bundle. Transaction aborted."
      }, { status: 502 });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
