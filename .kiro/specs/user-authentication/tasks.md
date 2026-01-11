# Implementation Plan

- [x] 1. Set up backend authentication infrastructure








  - [x] 1.1 Create Supabase client utility in backend


    - Create `backend/src/lib/supabase.ts` with Supabase client initialization
    - Use environment variables for SUPABASE_URL and SUPABASE_PROJECT_API_KEY
    - _Requirements: 1.1, 6.1_
  - [x] 1.2 Implement signup endpoint


    - Create POST `/auth/signup` route in `backend/src/auth.ts`
    - Validate email format and password length (min 8 chars)
    - Call Supabase Auth `signUp()` method
    - Return appropriate success/error responses
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.3 Implement login endpoint

    - Create POST `/auth/login` route
    - Call Supabase Auth `signInWithPassword()` method
    - Fetch user profile from database on successful auth
    - Return session tokens and user profile
    - _Requirements: 6.1, 6.2, 6.4, 6.5_

  - [x] 1.4 Implement signout endpoint

    - Create POST `/auth/signout` route
    - Call Supabase Auth `signOut()` method
    - Return success response
    - _Requirements: 7.1_

  - [x] 1.5 Implement profile update endpoint

    - Create PUT `/auth/profile` route
    - Accept userId, age, avatarUrl, planType in request body
    - Update user record in database
    - _Requirements: 5.1_

  - [x] 1.6 Implement resend verification endpoint

    - Create POST `/auth/resend-verification` route
    - Call Supabase Auth `resend()` method for email verification
    - _Requirements: 2.3_
  - [x] 1.7 Implement session validation endpoint


    - Create GET `/auth/session` route
    - Validate access token and return user profile if valid
    - _Requirements: 6.1, 8.2_

  - [x] 1.8 Register auth routes in main app

    - Import and mount auth routes in `backend/src/index.ts`
    - Configure CORS for frontend origin
    - _Requirements: 1.1, 6.1, 7.1_

- [x] 2. Set up frontend authentication infrastructure





  - [x] 2.1 Install Supabase client package


    - Add `@supabase/supabase-js` to frontend dependencies
    - _Requirements: 3.2, 8.2_
  - [x] 2.2 Create Supabase client utility


    - Create `frontend/src/lib/supabase.ts`
    - Initialize client with environment variables
    - Add `uploadProfilePhoto` helper function for avatar uploads
    - _Requirements: 3.2, 3.3_
  - [x] 2.3 Create Jotai auth atoms


    - Create `frontend/src/store/authAtoms.ts`
    - Define `authAtom` with user, tokens, and auth status
    - Use `atomWithStorage` for persistence
    - Create derived atoms for user and isAuthenticated
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 2.4 Create auth service


    - Create `frontend/src/services/authService.ts`
    - Implement signup, login, signout, updateProfile, getSession methods
    - Configure API base URL from environment
    - _Requirements: 1.1, 6.1, 7.1, 5.1_
  - [x] 2.5 Add environment variables


    - Create/update `.env` file with VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
    - _Requirements: 2.1, 3.2_

- [x] 3. Implement multi-step signup flow





  - [x] 3.1 Create SignupFlow container component


    - Create `frontend/src/components/signup/SignupFlow.tsx`
    - Manage step state (form, verification, profile, plan)
    - Handle step navigation and data persistence between steps
    - _Requirements: 2.1, 3.6, 4.2_
  - [x] 3.2 Create FormStep component


    - Create `frontend/src/components/signup/FormStep.tsx`
    - Implement email, password, fullName inputs with validation
    - Call signup API on form submit
    - Advance to verification step on success
    - _Requirements: 1.1, 1.2, 1.3, 1.5_
  - [x] 3.3 Create VerificationStep component


    - Create `frontend/src/components/signup/VerificationStep.tsx`
    - Display email verification pending message
    - Add resend verification button
    - Poll or listen for verification completion
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 3.4 Create ProfileStep component


    - Create `frontend/src/components/signup/ProfileStep.tsx`
    - Implement age input with validation (13-120)
    - Implement photo upload with file type/size validation
    - Upload photo to Supabase bucket and get URL
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  - [x] 3.5 Create PlanStep component


    - Create `frontend/src/components/signup/PlanStep.tsx`
    - Display Free, Pro, Premium plan cards with features
    - Handle plan selection
    - Call profile update API with selected plan
    - Update auth atom and redirect to dashboard
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.2, 5.3_
  - [x] 3.6 Create signup components index


    - Create `frontend/src/components/signup/index.ts` for exports
    - _Requirements: 3.1_

- [x] 4. Update existing auth pages





  - [x] 4.1 Update Signup page


    - Replace SignupModal with SignupFlow in `frontend/src/pages/Signup.tsx`
    - Handle email verification callback URL
    - _Requirements: 2.1, 5.3_
  - [x] 4.2 Update LoginModal component


    - Update `frontend/src/components/LoginModal.tsx` to use auth service
    - Update auth atom on successful login
    - Redirect to dashboard on success
    - Display appropriate error messages
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [x] 4.3 Update Login page


    - Update `frontend/src/pages/Login.tsx` if needed
    - _Requirements: 6.3_

- [x] 5. Implement session management and protected routes





  - [x] 5.1 Create auth hook


    - Create `frontend/src/hooks/useAuth.ts`
    - Provide login, logout, updateProfile functions
    - Handle session restoration on app load
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 5.2 Add signout functionality to dashboard


    - Update dashboard header/sidebar with signout button
    - Clear auth atom and redirect on signout
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 5.3 Update App.tsx with auth provider


    - Wrap app with Jotai Provider if needed
    - Add session restoration logic on mount
    - _Requirements: 8.2_

- [x] 6. Add email verification callback route





  - [x] 6.1 Create verification callback page


    - Create `frontend/src/pages/VerifyEmail.tsx`
    - Handle Supabase email verification callback
    - Redirect to signup flow profile step on success
    - _Requirements: 2.1, 2.4_
  - [x] 6.2 Add route to App.tsx


    - Add `/auth/verify` route for email verification callback
    - _Requirements: 2.1_

- [ ]* 7. Add tests for authentication
  - [ ]* 7.1 Write backend auth endpoint tests
    - Test signup with valid/invalid data
    - Test login with valid/invalid credentials
    - Test signout functionality
    - _Requirements: 1.1, 1.2, 1.3, 6.1, 6.4, 7.1_
  - [ ]* 7.2 Write frontend auth atom tests
    - Test atom state transitions
    - Test persistence behavior
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
