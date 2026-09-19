# AGENTS.md — Pre-Legal Document Generator

## 1. Project Overview

Project name: **Pre-Legal Document Generator**

Build a professional, production-ready SaaS web application that allows authenticated users to select pre-legal document templates, enter required information through structured forms, generate documents, preview them, and download them as PDF and DOCX.

This is an academic project. The application is a document drafting/pre-legal assistance tool and must not present itself as a replacement for a qualified lawyer or as providing legal advice.

---

## 2. Core Technology Stack

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* Supabase
* Supabase Auth
* PostgreSQL
* PDF generation
* DOCX generation
* Docker
* Vercel
* GitHub

GitHub repository:

`https://github.com/Biggner2big/Toyo.git`

Supabase project URL:

`https://ozsnxaxzdclegkyshhic.supabase.co`

Never hardcode Supabase secrets or private credentials.

Use environment variables and maintain:

`.env.example`

---

## 3. Product Type

This is a **free SaaS product**.

There will be:

* No payment gateway
* No subscription system
* No paid plans
* No billing system

The application should be designed so these could be added later without restructuring the entire project.

---

## 4. User Roles

For the initial version, support only:

### Normal User

A normal authenticated user can:

* Register
* Login
* Logout
* View dashboard
* Browse document templates
* Create documents
* Edit document data before generation
* Generate documents
* Preview documents
* Download PDF
* Download DOCX
* View their own document history
* Delete their own documents
* Manage basic profile information

Do not implement an admin panel unless explicitly requested later.

---

## 5. Authentication

Use **Supabase Authentication**.

Initial authentication method:

* Email/password registration
* Email/password login
* Logout
* Protected routes
* Persistent sessions
* Authentication error handling
* Loading states

Do not add Google, GitHub or other OAuth providers unless explicitly requested later.

Unauthenticated users must not access protected dashboard or private document data.

---

## 6. Database

Use Supabase PostgreSQL as the primary database.

Design the database around these core entities:

### profiles

Stores application-level user information.

Suggested fields:

* id
* full_name
* email
* avatar_url if needed
* created_at
* updated_at

The profile `id` should correspond to the Supabase Auth user ID.

### templates

Stores available document templates.

Suggested fields:

* id
* name
* slug
* description
* category
* template_type
* fields/schema definition
* document structure/content
* is_active
* created_at
* updated_at

Templates must be designed so new templates can be added without changing application code unnecessarily.

### documents

Stores user-created documents.

Suggested fields:

* id
* user_id
* template_id
* title
* status
* form_data
* generated_content if required
* created_at
* updated_at

`user_id` must reference the authenticated Supabase user.

---

## 7. Database Security

Supabase Row Level Security must be enabled.

Users must only be able to:

* Read their own profiles
* Update their own profiles
* Read their own documents
* Create documents belonging to themselves
* Update their own documents
* Delete their own documents

Users must never be able to access another user's private documents by changing an ID in the URL or request.

Templates can be publicly readable when active.

Never rely only on frontend checks for security. Enforce authorization through Supabase RLS/database policies.

---

## 8. Document Templates

The application should use a flexible template-driven architecture.

Initial templates should include several useful pre-legal examples such as:

* Non-Disclosure Agreement (NDA)
* Engagement Letter
* Basic Agreement/Contract
* Authorization Letter
* Declaration/Undertaking

The exact template list can be adjusted during implementation if required.

Each template should define its required fields.

Example field types may include:

* Text
* Email
* Phone
* Date
* Address
* Number
* Textarea
* Select
* Checkbox

Do not hardcode a separate form component for every template when a reusable dynamic form system can reasonably handle the fields.

---

## 9. Document Generation

The document generation flow should be:

Template selection
→ Dynamic form
→ Validation
→ Generate
→ Preview
→ Download

Generated documents should correctly insert user-provided values into the selected template.

Support:

* PDF generation
* DOCX generation

Generated files must have professional formatting and readable typography.

Do not generate intentionally misleading legal claims.

---

## 10. Main Application Pages

Expected structure:

### Public

* Landing page
* Login
* Register

### Protected

* Dashboard
* Templates
* Template details / document form
* Document preview
* My Documents
* Profile/Settings

The exact routing structure may be chosen by the implementation agent as long as it remains clean and scalable.

---

## 11. Dashboard

The dashboard should provide a clear SaaS experience.

Include:

* Welcome/user information
* Create Document CTA
* Available templates
* Recent documents
* Document count/statistics
* Navigation to templates
* Navigation to document history
* Profile/settings
* Logout

Do not overcrowd the dashboard.

---

## 12. My Documents

Users should be able to see their own generated documents.

Include:

* Document title
* Template name
* Creation date
* Updated date
* Status
* Open/view
* Download
* Delete

Add useful search/filter functionality if it can be implemented cleanly.

---

## 13. UI / UX

Design direction:

### Dark theme

The application should use a professional dark legal-tech SaaS aesthetic.

Requirements:

* Dark interface
* High readability
* Professional typography
* Consistent spacing
* Clean cards
* Subtle borders
* Clear buttons
* Accessible contrast
* Responsive layouts
* Desktop + tablet + mobile support

Avoid:

* Excessive gradients
* Excessive animations
* Unnecessary glassmorphism
* Overly flashy effects
* Cluttered layouts
* Generic AI-generated-looking interfaces

The design should feel like a real SaaS product.

---

## 14. Landing Page

The landing page should communicate:

* What Pre-Legal Document Generator does
* Why it is useful
* How the workflow works
* Available document templates
* Key features
* Call-to-action for registration/login

Keep legal disclaimers clear and professional.

---

## 15. Architecture

Use a clean and maintainable architecture.

Prefer:

* Reusable components
* Reusable UI primitives
* Server/client separation where appropriate
* Centralized Supabase utilities
* Typed database interactions
* Reusable document-generation utilities
* Reusable form components
* Clear feature boundaries

Do not put the entire application inside one giant component or page.

Avoid unnecessary dependencies.

---

## 16. Environment Variables

Never commit secrets.

Use environment variables such as:

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

Additional variables may be added when required by document generation or deployment.

Maintain:

`.env.example`

with variable names only and no real secrets.

---

## 17. Docker

Docker is a required assignment component.

The final project must include:

* `Dockerfile`
* `.dockerignore`
* `docker-compose.yml` where appropriate
* `.env.example`

The application must be capable of running inside Docker.

Docker configuration must support the production build.

Do not expose secrets inside Docker files.

---

## 18. Deployment

Deployment target:

**Vercel**

The final application must:

* Build successfully
* Have production environment variables configured
* Connect to the correct Supabase project
* Work without local-only assumptions
* Have authentication functioning in production
* Have database operations functioning in production

Before considering deployment complete, test the production URL.

---

## 19. Git / GitHub

Repository:

`https://github.com/Biggner2big/Toyo.git`

Use meaningful commits.

Do not commit:

* `.env`
* `.env.local`
* API secrets
* passwords
* private keys
* generated temporary files

Keep the repository clean and professional.

---

## 20. Development Workflow

Development must be incremental.

Do not attempt to implement the entire application in one step.

Recommended order:

1. Project foundation
2. UI/landing page
3. Supabase configuration
4. Authentication
5. Database schema
6. RLS/security
7. Dashboard
8. Template system
9. Dynamic document forms
10. Document generation
11. PDF/DOCX downloads
12. Document history
13. UI polish
14. Docker
15. Production build
16. Vercel deployment
17. Final testing

After each major increment:

* Run the application
* Test the feature
* Check console errors
* Check TypeScript errors
* Check lint errors
* Fix root causes
* Confirm existing functionality still works

---

## 21. Coding Rules

* Use TypeScript properly.
* Avoid `any` unless genuinely necessary.
* Prefer reusable components.
* Keep functions focused.
* Use meaningful names.
* Do not duplicate logic unnecessarily.
* Do not introduce unnecessary libraries.
* Do not rewrite working features without a reason.
* Do not modify unrelated functionality.
* Validate user input.
* Handle loading states.
* Handle error states.
* Handle empty states.
* Make UI responsive.
* Consider accessibility.
* Never expose secrets.
* Never trust client-side authorization alone.

---

## 22. Legal Safety

The application provides document drafting/pre-legal assistance.

The UI should clearly communicate that generated documents may require review by a qualified legal professional.

Do not claim that documents are universally legally valid in every jurisdiction.

Avoid presenting generated content as personalized legal advice.

---

## 23. Quality Requirements

Before marking a feature complete:

* Verify functionality manually.
* Verify mobile responsiveness.
* Verify authentication behavior where applicable.
* Verify database permissions.
* Verify unauthorized access is blocked.
* Verify no console errors.
* Verify TypeScript.
* Verify lint.
* Verify production build when appropriate.

Do not declare a feature complete merely because the code compiles.

---

## 24. Important Incremental Development Rule

When given a task, implement **only that task and its necessary dependencies**.

Do not automatically implement future features.

Do not change unrelated files.

If an existing implementation conflicts with a requirement, explain the conflict before making a broad architectural change.

Preserve existing working functionality.

---

## 25. Current Project State

The repository is intended for the **Pre-Legal Document Generator** project.

The project should be initialized and developed incrementally from this specification.

At the beginning of development, inspect the repository before making changes.

Determine:

* Existing files
* Existing framework
* Existing dependencies
* Existing configuration
* Existing Git state

Do not delete or overwrite existing work blindly.

---

## 26. Definition of Done

The final project is considered complete when:

* Users can register/login/logout.
* Users can securely access their own dashboard.
* Users can browse document templates.
* Users can select a template.
* Users can fill required information.
* Input is validated.
* Documents can be generated.
* Documents can be previewed.
* PDF can be downloaded.
* DOCX can be downloaded.
* Users can view their document history.
* Users can delete their own documents.
* Supabase authentication works.
* PostgreSQL database works.
* RLS protects private user data.
* UI is responsive.
* UI follows the dark professional design.
* Docker implementation works.
* Production build works.
* Application is deployed on Vercel.
* No secrets are committed.
* README documents setup and deployment.
* Major functionality has been tested.

---

## 27. Agent Behavior

Before coding:

1. Inspect the existing project.
2. Read this `AGENTS.md`.
3. Understand the current state.
4. Create a small implementation plan for the requested increment.
5. Implement only the requested increment.
6. Verify the implementation.
7. Report what changed, what was tested, and any remaining issue.

Never assume a feature is working without testing it.

Never fabricate successful tests.

If a required credential, configuration value, or external setup is missing, clearly identify what is required instead of using fake values.

**Follow this file as the project's primary development instruction unless a later explicit project requirement supersedes it.**
