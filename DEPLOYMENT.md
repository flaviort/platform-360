# Deployment Guide - Handling Timeouts and Duplicate Charts (Pro Plan)

## Problem Summary

When deploying to Vercel, you may encounter:
1. **504 Gateway Timeout errors** - Function execution exceeds Vercel's limits
2. **Duplicate chart creation** - Retry logic continues after timeouts, causing duplicates
3. **FUNCTION_INVOCATION_TIMEOUT** - Vercel terminates long-running functions

## Solution Implemented (Pro Plan Optimized)

### 1. Dynamic Timeout Configuration
- **Local Development**: 2 minutes (120 seconds)
- **Vercel Pro Deployment**: 4.5 minutes (270 seconds) - utilizing Pro plan's 5-minute limit
- **Other Environments**: 1 minute (60 seconds)

### 2. Duplicate Prevention System
```typescript
// Three layers of protection:
1. Request ID tracking - Prevents concurrent duplicate requests
2. Database verification - Checks for existing charts before creation
3. Smart retry logic - Handles 504 errors without aggressive retries
```

### 3. Vercel Pro Configuration
```json
// vercel.json (Pro Plan Optimized)
{
  "functions": {
    "src/app/api/proxy/route.ts": {
      "maxDuration": 300  // Maximum Pro plan duration (5 minutes)
    },
    "src/app/api/**/route.ts": {
      "maxDuration": 120  // 2 minutes for other endpoints
    }
  }
}
```

## Pro Plan Benefits

### Extended Timeout Limits
- **Standard Pro**: Up to 300 seconds (5 minutes)
- **Pro + Fluid Compute**: Up to 800 seconds (13+ minutes)
- **Reduced stagger delay**: 1 second (vs 3 seconds on Hobby plan)
- **Longer backoff times**: More patient retry logic

### Performance Improvements
- **Faster chart creation**: Reduced delays between chart requests
- **Better error recovery**: Longer timeouts mean fewer false timeouts
- **More generous retry logic**: Can afford longer waits between retries

## Deployment Steps

### Step 1: Enable Fluid Compute (Highly Recommended for Pro)
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Functions**
3. Enable **Fluid Compute** toggle
4. Redeploy your project

**Pro + Fluid Compute Benefits**: 
- Up to 800 seconds (13+ minutes) function duration
- Better resource utilization
- Reduced cold starts

### Step 2: Monitor Function Logs
```bash
# View real-time logs
vercel logs --follow

# Check for timeout patterns (should be much rarer now)
vercel logs | grep -E "(504|timeout|FUNCTION_INVOCATION_TIMEOUT)"
```

### Step 3: Verify Environment Variables
Ensure these are set correctly in Vercel:
- `NODE_ENV=production`
- `VERCEL=1` (automatically set by Vercel)
- `VERCEL_ENV=production` (automatically set by Vercel)

## Testing the Fix

### 1. Check Timeout Detection
Look for these logs in your Vercel function logs:
```
Environment detection: NODE_ENV=production, VERCEL=1, VERCEL_ENV=production
Using Vercel Pro timeout: 4.5 minutes (270 seconds)
```

### 2. Monitor Chart Creation (Should be much faster)
Watch for these status updates:
```
Starting staggered creation of 2 charts with 1000ms delay between each request...
Chart progress: Geography Trend - creating
Chart progress: Category Trend - creating
Chart creation completed: 2 successful, 0 failed, 0 duplicates prevented, 0 total retries
```

### 3. Background Retry Monitoring (Should be less frequent)
Failed charts are automatically retried in the background:
```
Retrying 0 failed charts in background... (should see fewer failures)
Background retry completed: 0/0 charts recovered
```

## Troubleshooting

### Issue: Still getting 504 errors (Rare with Pro plan)
**Solutions**:
1. Enable Fluid Compute for 800s timeout limit
2. Check if your backend API is the bottleneck
3. Consider Enterprise plan for 15-minute timeouts

### Issue: Charts taking too long even with Pro timeouts
**Check**:
1. Backend API performance
2. Database query optimization
3. Network latency issues

### Issue: Want even longer timeouts
**Options**:
1. **Enable Fluid Compute**: 800s limit (13+ minutes)
2. **Upgrade to Enterprise**: 900s limit (15 minutes)
3. **Consider background processing**: For extremely long operations

## Performance Optimization (Pro Plan)

### 1. Aggressive Chart Creation
Charts are created with 1-second delays to maximize Pro plan benefits:
```typescript
delayMs: number = 1000 // Fast creation with Pro plan timeouts
```

### 2. Patient Retry Logic
- Fewer retries needed due to longer timeouts
- Longer backoff times (8s, 16s, 32s) for 504 errors
- More time for background processing to complete

### 3. Request Deduplication
Active request tracking prevents concurrent creation of identical charts.

## Monitoring and Alerts

### Key Metrics to Watch (Pro Plan)
1. **Function Duration**: Should stay well under 270 seconds
2. **Error Rate**: Should be significantly reduced with Pro timeouts
3. **Chart Creation Speed**: Faster with 1s stagger delay
4. **Background Retry Rate**: Should be much lower

### Expected Performance (Pro Plan)
```bash
# Success patterns (faster)
"Chart creation completed: X successful, 0 failed, 0 duplicates prevented"

# Rare warning patterns  
"504 Gateway Timeout on attempt" (should be very rare now)
"Duplicate chart creation prevented" (safety net)

# Should not see these anymore
"FUNCTION_INVOCATION_TIMEOUT" (resolved with 5-minute limit)
"Request timeout after 45000ms" (now 270000ms)
```

## Fluid Compute Recommendation

With your Pro plan, **strongly consider enabling Fluid Compute** for:
- ✅ 800-second (13+ minutes) function duration
- ✅ Better resource pooling and efficiency  
- ✅ Reduced cold starts
- ✅ More stable long-running operations

## Contact

With Pro plan timeouts, most timeout issues should be resolved. If issues persist:
1. Check backend API performance (may be the bottleneck now)
2. Enable Fluid Compute for maximum timeout benefits
3. Monitor for any remaining 504 patterns (should be rare)
4. Consider if Enterprise plan (15-minute timeouts) is needed 