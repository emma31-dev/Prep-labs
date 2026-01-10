# Requirements Document

## Introduction

This document defines the requirements for implementing a complete user authentication system with a multi-step signup flow. The system includes backend authentication endpoints (signup, login, signout) using Supabase Auth, and a frontend signup flow that guides users through form filling, email verification, profile completion (age and photo upload to Supabase bucket), plan selection (Free, Pro, Premium), and finally redirects to the home dashboard. Session management on the frontend will use Jotai atoms.

## Glossary

- **Authentication_System**: The backend service responsible for handling user signup, login, signout, and session validation using Supabase Auth
- **Signup_Flow**: The multi-step frontend process that guides users from initial registration through email verification, profile completion, and plan selection
- **Session_Atom**: A Jotai atom that stores and manages the current user's authentication state and profile data
- **Supabase_Bucket**: Cloud storage service for storing user-uploaded profile photos
- **Plan_Type**: The subscription tier selected by the user (Free, Pro, or Premium)
- **Email_Verification**: The process of confirming a user's email address via a verification link sent to their inbox

## Requirements

### Requirement 1: User Signup

**User Story:** As a new user, I want to create an account with my email and password, so that I can access the application's features.

#### Acceptance Criteria

1. WHEN a user submits valid signup credentials (email, password, full name), THE Authentication_System SHALL create a new user account in Supabase Auth and return a success response within 5 seconds.
2. WHEN a user submits an email that already exists in the system, THE Authentication_System SHALL return an error response with status code 409 and message "Email already registered".
3. WHEN a user submits a password shorter than 8 characters, THE Authentication_System SHALL return an error response with status code 400 and message "Password must be at least 8 characters".
4. WHEN a user account is created successfully, THE Authentication_System SHALL trigger Supabase to send a verification email to the provided email address.
5. THE Authentication_System SHALL validate that the email format is valid before attempting account creation.

### Requirement 2: Email Verification

**User Story:** As a new user, I want to verify my email address, so that I can confirm my identity and proceed with account setup.

#### Acceptance Criteria

1. WHEN a user clicks the verification link in their email, THE Signup_Flow SHALL display a confirmation message and automatically advance to the profile completion step.
2. WHILE a user's email is not verified, THE Signup_Flow SHALL display the email verification pending screen with options to resend the verification email.
3. WHEN a user requests to resend the verification email, THE Authentication_System SHALL send a new verification email within 3 seconds and display a confirmation message.
4. IF a verification link has expired, THEN THE Signup_Flow SHALL display an error message and provide an option to request a new verification email.

### Requirement 3: Profile Completion (Age and Photo Upload)

**User Story:** As a verified user, I want to complete my profile with my age and photo, so that my account has complete information.

#### Acceptance Criteria

1. WHEN a user enters their age and uploads a profile photo, THE Signup_Flow SHALL validate that age is a positive integer between 13 and 120.
2. WHEN a user uploads a profile photo, THE Signup_Flow SHALL upload the image to Supabase_Bucket and retrieve the public URL within 10 seconds.
3. WHEN a photo upload succeeds, THE Signup_Flow SHALL store the returned URL in the user profile data.
4. IF a photo upload fails, THEN THE Signup_Flow SHALL display an error message and allow the user to retry the upload.
5. THE Signup_Flow SHALL accept image files in PNG, JPG, or JPEG format with a maximum size of 5MB.
6. WHEN the user completes the profile form and clicks continue, THE Signup_Flow SHALL advance to the plan selection step.

### Requirement 4: Plan Selection

**User Story:** As a new user, I want to select a subscription plan, so that I can access features appropriate to my needs.

#### Acceptance Criteria

1. THE Signup_Flow SHALL display three plan options: Free, Pro, and Premium with their respective features and pricing.
2. WHEN a user selects a plan and confirms, THE Signup_Flow SHALL store the selected Plan_Type in the user profile.
3. THE Signup_Flow SHALL allow users to select the Free plan without requiring payment information.
4. WHEN a user selects Pro or Premium plan, THE Signup_Flow SHALL store the plan selection and proceed without payment processing (payment handling deferred).

### Requirement 5: User Object Storage and Dashboard Redirect

**User Story:** As a user who completed signup, I want my profile to be saved and to be redirected to the dashboard, so that I can start using the application.

#### Acceptance Criteria

1. WHEN all signup steps are completed, THE Authentication_System SHALL update the user record in the database with full_name, avatar_url, age, and plan_type.
2. WHEN the user object is successfully stored, THE Signup_Flow SHALL update the Session_Atom with the complete user data.
3. WHEN the Session_Atom is updated with valid user data, THE Signup_Flow SHALL redirect the user to the home dashboard within 1 second.

### Requirement 6: User Login

**User Story:** As a returning user, I want to log in with my credentials, so that I can access my account and saved data.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials, THE Authentication_System SHALL authenticate the user and return a session token within 3 seconds.
2. WHEN login is successful, THE Session_Atom SHALL be updated with the user's profile data and session information.
3. WHEN login is successful, THE Signup_Flow SHALL redirect the user to the home dashboard.
4. IF a user submits invalid credentials, THEN THE Authentication_System SHALL return an error response with status code 401 and message "Invalid email or password".
5. IF a user attempts to login with an unverified email, THEN THE Authentication_System SHALL return an error response with status code 403 and message "Please verify your email before logging in".

### Requirement 7: User Signout

**User Story:** As a logged-in user, I want to sign out of my account, so that I can securely end my session.

#### Acceptance Criteria

1. WHEN a user initiates signout, THE Authentication_System SHALL invalidate the current session in Supabase Auth.
2. WHEN signout is successful, THE Session_Atom SHALL be cleared of all user data.
3. WHEN signout is successful, THE Signup_Flow SHALL redirect the user to the landing page.

### Requirement 8: Session Management with Jotai

**User Story:** As a developer, I want session state managed via Jotai atoms, so that authentication state is consistent across the application.

#### Acceptance Criteria

1. THE Session_Atom SHALL store the current user object including id, email, full_name, avatar_url, plan_type, and authentication status.
2. WHEN the application loads, THE Session_Atom SHALL check for an existing Supabase session and restore user data if valid.
3. WHILE a user is authenticated, THE Session_Atom SHALL provide the user object to any component that subscribes to it.
4. WHEN the Supabase session expires or is invalidated, THE Session_Atom SHALL automatically clear user data and update authentication status to false.
