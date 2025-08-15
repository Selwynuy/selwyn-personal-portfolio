# Testing Sign-Up Flow

## Current Flow:
1. User signs up → `/auth/sign-up`
2. Form submission → Server action `signUp()`
3. Supabase creates user → Sends confirmation email
4. User redirected to → `/auth/sign-up-success`
5. User clicks email link → `/auth/confirm` → Redirects to home page

## To Test:
1. Go to `/auth/sign-up`
2. Fill out the form with a real email
3. Submit the form
4. Check your email for confirmation link
5. Click the confirmation link
6. Should be redirected back to your site and logged in

## Environment Variables Needed:
- `NEXT_PUBLIC_SITE_URL` should be set to your domain (e.g., `http://localhost:3000` for dev)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` - Your Supabase anon key

## What Should Happen:
✅ User gets created in Supabase Auth
✅ Profile gets created in your `profiles` table
✅ Email confirmation sent
✅ User can confirm and login
✅ Profile dropdown appears after login

