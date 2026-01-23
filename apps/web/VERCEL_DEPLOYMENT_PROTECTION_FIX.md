# Vercel Deployment Protection - Callback URL Fix

## 🚨 Problem

The Ameria Bank callback URL is blocked by Vercel Deployment Protection:

```
https://white-deploy-web-git-main-neetrinos-projects.vercel.app/api/v1/payments/ameria/callback
```

**HTTP Status:** 401 Unauthorized  
**Response:** "Authentication Required" - Vercel Deployment Protection

## 🔍 Root Cause

Preview deployments (indicated by `git-main` in the URL) have Vercel Authentication enabled by default. When Ameria Bank redirects users back after payment, Vercel blocks the request because it requires authentication.

## ✅ Solution Options

### Option 1: Disable Protection for Preview Deployments (Recommended for Testing)

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Deployment Protection**
4. Under **Preview Deployments**, disable **"Vercel Authentication"**
5. Save changes

**Pros:**
- Quick fix
- No code changes needed
- Allows testing immediately

**Cons:**
- Reduces security for preview deployments
- Only affects preview deployments, not production

---

### Option 2: Use Production Domain (Recommended for Production)

**Steps:**
1. Configure a production domain in Vercel Dashboard
2. Production domains typically don't have Deployment Protection enabled
3. Update callback URL in admin panel to use production domain:
   ```
   https://yourdomain.com/api/v1/payments/ameria/callback
   ```

**Pros:**
- Professional approach
- Keeps preview deployments protected
- Production-ready solution

**Cons:**
- Requires production domain setup
- Need to update callback URL configuration

---

### Option 3: Exclude Callback Route (If Supported)

**Note:** Vercel Deployment Protection cannot be bypassed via `vercel.json` for specific routes. It's a dashboard-level setting.

However, you can try:
1. Go to Vercel Dashboard → Project Settings → Deployment Protection
2. Look for "Bypass" or "Exclude" options
3. Add the callback route: `/api/v1/payments/ameria/callback`

**Note:** This feature may not be available in all Vercel plans.

---

## 🔧 Current Configuration

The callback endpoint is located at:
- **Route:** `apps/web/app/api/v1/payments/ameria/callback/route.ts`
- **URL Pattern:** `/api/v1/payments/ameria/callback`
- **Methods:** `GET` (user redirect) and `POST` (webhook, if needed)

## 📝 Verification Steps

After applying the fix:

1. **Test Payment Flow:**
   - Create a test order
   - Select Ameria Bank payment
   - Complete payment on Ameria Bank page
   - Verify redirect back to callback URL works

2. **Check Logs:**
   - Look for callback logs: `📞 [AMERIA CALLBACK] Received redirect callback`
   - Verify no 401 errors

3. **Verify Order Status:**
   - Check that order status updates correctly
   - Payment should move from "processing" to "paid" or "failed"

## 🚀 Quick Fix (Immediate Testing)

For immediate testing, use **Option 1**:

1. Vercel Dashboard → Your Project → Settings
2. Deployment Protection → Preview Deployments
3. Disable "Vercel Authentication"
4. Test payment flow

## 🏭 Production Setup

For production, use **Option 2**:

1. Set up production domain
2. Update callback URL in admin panel (`/admin/payments`)
3. Verify callback URL uses production domain
4. Test payment flow on production domain

---

## 📚 References

- [Vercel Deployment Protection Documentation](https://vercel.com/docs/security/deployment-protection)
- [Vercel Preview Deployments](https://vercel.com/docs/deployments/preview-deployments)

