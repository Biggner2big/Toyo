-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core schema, RLS policies, trigger and seed templates for Pre-Legal Document Generator
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    template_type TEXT DEFAULT 'general' NOT NULL,
    fields_schema JSONB DEFAULT '[]'::jsonb NOT NULL,
    document_content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'completed' NOT NULL,
    form_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    generated_content TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Templates RLS (Public read for active templates)
DROP POLICY IF EXISTS "Active templates are readable by everyone" ON public.templates;
CREATE POLICY "Active templates are readable by everyone"
    ON public.templates FOR SELECT
    USING (is_active = true);

-- Documents RLS (Strict tenant isolation)
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Users can insert their own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGERS & FUNCTIONS
-- ==============================================================================

-- Trigger to create profile upon new Supabase auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS update_templates_modtime ON public.templates;
CREATE TRIGGER update_templates_modtime
    BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

DROP TRIGGER IF EXISTS update_documents_modtime ON public.documents;
CREATE TRIGGER update_documents_modtime
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- ==============================================================================
-- SEED DATA: 5 CORE PRE-LEGAL TEMPLATES
-- ==============================================================================

INSERT INTO public.templates (name, slug, description, category, template_type, fields_schema, document_content, is_active)
VALUES
-- 1. Non-Disclosure Agreement (NDA)
(
    'Non-Disclosure Agreement (NDA)',
    'non-disclosure-agreement',
    'Standard confidential disclosure agreement protecting proprietary trade secrets, intellectual property, and sensitive commercial data between two parties.',
    'Confidentiality & IP',
    'agreement',
    '[
        {"name": "agreement_date", "label": "Agreement Date", "type": "date", "required": true},
        {"name": "disclosing_party_name", "label": "Disclosing Party / Entity Name", "type": "text", "required": true, "placeholder": "e.g. Acme Innovations Corp."},
        {"name": "disclosing_party_address", "label": "Disclosing Party Address", "type": "text", "required": true, "placeholder": "123 Technology Way, Suite 400, San Francisco, CA"},
        {"name": "receiving_party_name", "label": "Receiving Party / Entity Name", "type": "text", "required": true, "placeholder": "e.g. John Doe / Global Tech LLC"},
        {"name": "receiving_party_address", "label": "Receiving Party Address", "type": "text", "required": true, "placeholder": "456 Market St, New York, NY"},
        {"name": "purpose", "label": "Business Purpose of Disclosure", "type": "textarea", "required": true, "placeholder": "e.g. Evaluating a potential strategic partnership and joint software development collaboration."},
        {"name": "term_duration_years", "label": "Confidentiality Duration (Years)", "type": "select", "required": true, "options": ["1 Year", "2 Years", "3 Years", "5 Years", "Indefinitely / In Perpetuity"], "defaultValue": "2 Years"},
        {"name": "governing_law", "label": "Governing Jurisdiction / State / Country", "type": "text", "required": true, "placeholder": "e.g. State of California, United States"}
    ]'::jsonb,
    'NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS NON-DISCLOSURE AGREEMENT ("Agreement") is made and entered into as of {{agreement_date}} ("Effective Date"), by and between:

DISCLOSING PARTY: {{disclosing_party_name}}, having its principal place of business/residence at {{disclosing_party_address}} ("Disclosing Party"), and

RECEIVING PARTY: {{receiving_party_name}}, having its principal place of business/residence at {{receiving_party_address}} ("Receiving Party").

(Collectively referred to as the "Parties" and individually as a "Party".)

1. PURPOSE
The Disclosing Party agrees to disclose to the Receiving Party certain confidential, proprietary, and non-public information solely for the purpose of:
{{purpose}} (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged, whether disclosed orally, in writing, electronically, or by inspection of tangible objects.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party shall:
(a) Hold the Confidential Information in strict confidence using at least the same degree of care as it uses to protect its own confidential information of like nature, but no less than reasonable care;
(b) Not disclose such Confidential Information to any third party without prior written consent of the Disclosing Party;
(c) Restrict disclosure of such Confidential Information solely to its employees, contractors, and legal advisors who have a need to know such information for the authorized Purpose.

4. EXCLUSIONS
Confidential Information does not include information that:
(a) is or becomes publicly known through no breach of this Agreement;
(b) was already known to the Receiving Party prior to disclosure without an obligation of confidentiality;
(c) is independently developed by the Receiving Party without reference to or reliance on the Disclosing Party''s Confidential Information.

5. DURATION AND TERM
The obligations of confidentiality under this Agreement shall survive and remain binding for a period of {{term_duration_years}} from the Effective Date.

6. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws of {{governing_law}}, without giving effect to any principles of conflicts of law.

IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the date first written above.

______________________________________
For Disclosing Party: {{disclosing_party_name}}
Date: {{agreement_date}}

______________________________________
For Receiving Party: {{receiving_party_name}}
Date: {{agreement_date}}',
    true
),

-- 2. Independent Contractor / Service Agreement
(
    'Independent Contractor Agreement',
    'independent-contractor-agreement',
    'Comprehensive contract defining contractor scope of work, milestone deliverables, compensation structure, independent status, and intellectual property assignment.',
    'Employment & Services',
    'agreement',
    '[
        {"name": "effective_date", "label": "Effective Date", "type": "date", "required": true},
        {"name": "client_name", "label": "Client / Company Name", "type": "text", "required": true, "placeholder": "e.g. Apex Enterprises Inc."},
        {"name": "client_address", "label": "Client Address", "type": "text", "required": true, "placeholder": "789 Corporate Blvd, Austin, TX"},
        {"name": "contractor_name", "label": "Contractor Full Name / Business", "type": "text", "required": true, "placeholder": "e.g. Alex Rivera"},
        {"name": "contractor_address", "label": "Contractor Address", "type": "text", "required": true, "placeholder": "101 Freelance Row, Seattle, WA"},
        {"name": "services_description", "label": "Scope of Services & Deliverables", "type": "textarea", "required": true, "placeholder": "e.g. Full-stack software architecture, API design, frontend development, and automated testing."},
        {"name": "payment_terms", "label": "Compensation and Payment Terms", "type": "textarea", "required": true, "placeholder": "e.g. $75 per hour, billed bi-weekly with net-15 payment terms upon invoice receipt."},
        {"name": "completion_date", "label": "Expected Completion / Termination Date", "type": "text", "required": true, "placeholder": "e.g. December 31, 2026 or Upon milestone completion"},
        {"name": "governing_jurisdiction", "label": "Governing Jurisdiction", "type": "text", "required": true, "placeholder": "e.g. State of Texas, United States"}
    ]'::jsonb,
    'INDEPENDENT CONTRACTOR AGREEMENT

THIS INDEPENDENT CONTRACTOR AGREEMENT ("Agreement") is made effective as of {{effective_date}}, by and between:

CLIENT: {{client_name}}, with its principal place of business at {{client_address}} ("Client"), and
CONTRACTOR: {{contractor_name}}, with a principal address at {{contractor_address}} ("Contractor").

1. ENGAGEMENT AND SCOPE OF SERVICES
Client hereby engages Contractor, and Contractor agrees to perform, the following services and deliverables:
{{services_description}}

2. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor, not an employee, agent, or partner of Client. Contractor is solely responsible for all federal, state, and local taxes, insurance, licenses, and permits required in connection with performing the Services.

3. COMPENSATION & PAYMENT TERMS
Client agrees to compensate Contractor according to the following agreed terms:
{{payment_terms}}

4. TERM AND TERMINATION
This Agreement shall commence on {{effective_date}} and shall continue until {{completion_date}}, unless terminated earlier by either party with 14 days written notice.

5. INTELLECTUAL PROPERTY / WORK MADE FOR HIRE
All work product, code, documentation, designs, and materials created by Contractor for Client under this Agreement shall be considered "work made for hire" and shall be the sole and exclusive property of the Client upon full payment of agreed compensation.

6. GOVERNING LAW
This Agreement shall be governed by and interpreted under the laws of {{governing_jurisdiction}}.

IN WITNESS WHEREOF, the parties hereto have executed this Independent Contractor Agreement as of the date first set forth above.

______________________________________
Client Signature: {{client_name}}
Date: {{effective_date}}

______________________________________
Contractor Signature: {{contractor_name}}
Date: {{effective_date}}',
    true
),

-- 3. Professional Engagement Letter
(
    'Professional Engagement Letter',
    'professional-engagement-letter',
    'Formal engagement letter outlining professional advisory services, billing arrangements, scope limitations, and mutual responsibilities.',
    'Business & Consulting',
    'letter',
    '[
        {"name": "letter_date", "label": "Date of Letter", "type": "date", "required": true},
        {"name": "service_provider_name", "label": "Service Provider / Firm Name", "type": "text", "required": true, "placeholder": "e.g. Sterling Strategy Consulting Group"},
        {"name": "service_provider_address", "label": "Firm Address", "type": "text", "required": true, "placeholder": "500 Financial Center, Boston, MA"},
        {"name": "client_name", "label": "Client Contact Name / Company", "type": "text", "required": true, "placeholder": "e.g. Jane Smith, CEO at Horizon Health Inc."},
        {"name": "client_address", "label": "Client Address", "type": "text", "required": true, "placeholder": "202 Health Plaza, Chicago, IL"},
        {"name": "scope_of_engagement", "label": "Scope of Engagement & Objectives", "type": "textarea", "required": true, "placeholder": "e.g. Conducting technical audit, cloud infrastructure evaluation, and cybersecurity readiness assessment."},
        {"name": "fee_arrangement", "label": "Fee Structure & Retainer", "type": "textarea", "required": true, "placeholder": "e.g. Fixed engagement fee of $15,000 payable 50% upon execution and 50% upon final report delivery."},
        {"name": "contact_email", "label": "Official Communication Email", "type": "email", "required": true, "placeholder": "contact@sterlinggroup.com"}
    ]'::jsonb,
    'PROFESSIONAL ENGAGEMENT LETTER

Date: {{letter_date}}

To:
{{client_name}}
{{client_address}}

From:
{{service_provider_name}}
{{service_provider_address}}
Email: {{contact_email}}

Dear {{client_name}},

We are pleased to confirm our acceptance and our understanding of the terms and objectives of our engagement with your organization.

1. SCOPE OF SERVICES
{{service_provider_name}} will provide professional consulting and advisory services described as follows:
{{scope_of_engagement}}

2. CLIENT RESPONSIBILITIES
To ensure the timely and effective delivery of our services, you agree to provide timely access to relevant records, documentation, personnel, and information reasonably requested.

3. FEES AND BILLING ARRANGEMENTS
Our fees for this engagement are structured as follows:
{{fee_arrangement}}
Invoices are payable upon receipt.

4. CONFIDENTIALITY & LIMITATION OF LIABILITY
Both parties agree to treat all exchanged confidential and proprietary business information with the strictest confidence. Our total liability for any claim arising out of this engagement shall not exceed the total fees paid to us for these specific services.

Please confirm your agreement to these terms by signing below and returning a copy to {{contact_email}}.

Sincerely,

______________________________________
For: {{service_provider_name}}
Date: {{letter_date}}

ACKNOWLEDGED AND AGREED:

______________________________________
Client Representative: {{client_name}}
Date: {{letter_date}}',
    true
),

-- 4. General Authorization Letter
(
    'General Authorization Letter',
    'general-authorization-letter',
    'Official letter delegating specific representation authority, administrative signing power, or property/account management privileges to an authorized representative.',
    'Authorizations & Legal',
    'letter',
    '[
        {"name": "issue_date", "label": "Date of Issuance", "type": "date", "required": true},
        {"name": "authorizer_name", "label": "Grantor / Authorizer Full Name", "type": "text", "required": true, "placeholder": "e.g. Michael Robinson"},
        {"name": "authorizer_id_number", "label": "Authorizer ID / Passport / National ID", "type": "text", "required": true, "placeholder": "e.g. Passport No. A98765432"},
        {"name": "authorizer_address", "label": "Authorizer Address", "type": "text", "required": true, "placeholder": "77 Sunset Way, Miami, FL"},
        {"name": "authorized_agent_name", "label": "Designated Agent Full Name", "type": "text", "required": true, "placeholder": "e.g. Sarah Jenkins"},
        {"name": "authorized_agent_id", "label": "Agent ID / Passport / National ID", "type": "text", "required": true, "placeholder": "e.g. DL No. D1234567"},
        {"name": "delegated_powers", "label": "Specific Powers and Acts Authorized", "type": "textarea", "required": true, "placeholder": "e.g. Submit, sign, collect, and execute all statutory documentation relating to property registration and utility account transfers on my behalf."},
        {"name": "validity_period", "label": "Validity Period / Expiration", "type": "text", "required": true, "placeholder": "e.g. Valid until November 30, 2026 or until revoked in writing"}
    ]'::jsonb,
    'GENERAL LETTER OF AUTHORIZATION

Date: {{issue_date}}

TO WHOM IT MAY CONCERN:

I, {{authorizer_name}}, holder of identification document {{authorizer_id_number}}, residing at {{authorizer_address}} (hereinafter referred to as the "Grantor"), do hereby appoint and grant full authorization to:

DESIGNATED REPRESENTATIVE: {{authorized_agent_name}}
Identification Document: {{authorized_agent_id}}
(hereinafter referred to as the "Authorized Agent")

AUTHORIZATION OF POWERS:
The Authorized Agent is hereby empowered to act in my name and on my behalf to perform the following specific actions and duties:
{{delegated_powers}}

PERIOD OF VALIDITY:
This authorization letter is effective immediately on {{issue_date}} and shall remain in full force and effect until:
{{validity_period}}, unless revoked by me prior to that date by written notice.

RATIFICATION:
I hereby ratify and confirm all lawful acts and representations executed by my Authorized Agent within the scope of authority granted under this instrument.

IN WITNESS WHEREOF, I have executed this Letter of Authorization on the date first written above.

______________________________________
Grantor Signature: {{authorizer_name}}
ID: {{authorizer_id_number}}
Date: {{issue_date}}

______________________________________
Agent Acknowledgment: {{authorized_agent_name}}
ID: {{authorized_agent_id}}
Date: {{issue_date}}',
    true
),

-- 5. Declaration & Undertaking
(
    'Declaration & Undertaking (Affidavit of Fact)',
    'declaration-and-undertaking',
    'Formal written declaration, statement of truth, and legal undertaking affirming factual accuracy and compliance with rules or contractual conditions.',
    'Authorizations & Legal',
    'declaration',
    '[
        {"name": "declaration_date", "label": "Date of Declaration", "type": "date", "required": true},
        {"name": "declarant_name", "label": "Declarant Full Legal Name", "type": "text", "required": true, "placeholder": "e.g. David Alexander Vance"},
        {"name": "declarant_identity", "label": "Declarant ID / Registration / Passport No.", "type": "text", "required": true, "placeholder": "e.g. ID # 987-654-321"},
        {"name": "declarant_address", "label": "Residential / Business Address", "type": "text", "required": true, "placeholder": "14 Kensington Court, London, UK"},
        {"name": "recipient_organization", "label": "Addressed To (Authority / Organization)", "type": "text", "required": true, "placeholder": "e.g. Regulatory Compliance Authority / Executive Board"},
        {"name": "statement_of_facts", "label": "Statement of Facts & Declaration Details", "type": "textarea", "required": true, "placeholder": "e.g. I hereby solemnly declare and affirm that all documentation, financial statements, and background records submitted are true, authentic, and complete in all material aspects."},
        {"name": "undertaking_commitments", "label": "Undertakings & Obligations Assumed", "type": "textarea", "required": true, "placeholder": "e.g. I undertake to notify the authority immediately within 48 hours of any material change in the status of the facts affirmed herein."},
        {"name": "jurisdiction_city", "label": "City / Location of Execution", "type": "text", "required": true, "placeholder": "e.g. London, United Kingdom"}
    ]'::jsonb,
    'FORMAL DECLARATION AND UNDERTAKING

I, {{declarant_name}}, holder of identification document {{declarant_identity}}, residing at {{declarant_address}} (the "Declarant"), do hereby make this solemn declaration addressed to {{recipient_organization}}:

1. STATEMENT OF FACTS
I solemnly state, affirm, and declare under penalty of perjury/misrepresentation that:
{{statement_of_facts}}

2. UNDERTAKING AND OBLIGATIONS
In furtherance of this declaration, I formally undertake and bind myself to the following commitments:
{{undertaking_commitments}}

3. VERIFICATION AND TRUTHFULNESS
I confirm that the statements made herein are true and correct to the best of my knowledge, information, and belief, and that no material fact has been concealed or omitted.

Declared at {{jurisdiction_city}} on this day of {{declaration_date}}.

______________________________________
Declarant Signature: {{declarant_name}}
ID: {{declarant_identity}}
Date: {{declaration_date}}',
    true
)
ON CONFLICT (slug) DO UPDATE
SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    fields_schema = EXCLUDED.fields_schema,
    document_content = EXCLUDED.document_content,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
