#!/usr/bin/env python3
"""Replace Cedar copy with ASHA AI text in the static landing clone. Keeps all assets and HTML structure."""

from pathlib import Path
import re

HTML = Path(__file__).resolve().parent.parent / "frontend/public/landing/index.html"

REPLACEMENTS = [
    # Meta & brand
    ("<title>Cedar</title>", "<title>ASHA AI</title>"),
    ('<meta content="Cedar" property="og:title">', '<meta content="ASHA AI" property="og:title">'),
    ('<meta content="Cedar" name="twitter:title">', '<meta content="ASHA AI" name="twitter:title">'),
    ('https://www.linkedin.com/company/cedar', 'https://www.linkedin.com/company/asha-ai'),
    ('https://twitter.com/cedar', 'https://twitter.com/asha_ai'),
    ('"name": "Cedar"', '"name": "ASHA AI"'),
    ('info@cedar.com', 'hello@asha-ai.org'),
    ('Cedar Cares, Inc.', 'ASHA AI'),
    ('Copyright © 2026 Cedar Cares, Inc.', 'Copyright © 2026 ASHA AI'),
    ('data-wf-domain="www.cedar.com"', 'data-wf-domain="asha-ai.org"'),

    # Descriptions
    (
        "Cedar unifies billing, payments, coverage, and support through one intelligent platform driving stronger margins for providers and simpler patient experiences.",
        "ASHA AI unifies voice guidance, maternal care, scheme access, and ASHA worker tools through one intelligent platform for rural India.",
    ),
    (
        "Cedar unifies billing, payments, coverage, and support through one intelligent platform driving stronger margins for providers and simpler financial experiences for patients.",
        "ASHA AI delivers voice-first maternal health guidance, offline care tools, and village analytics for women, ASHA workers, and healthcare partners.",
    ),

    # Hero
    ("50</span>M patients served nationwide", "300</span>M women reached across India"),
    (
        "Built for patients.\u2028Powered by intelligence.\u2028Proven in performance.",
        "Built for her.\u2028Powered by voice.\u2028Proven in rural care.",
    ),
    (
        "Cedar unifies billing, payments, coverage, and support through one intelligent platform—driving stronger margins for providers and simpler financial experiences for patients.",
        "ASHA AI gives rural women and adolescent girls private, voice-first guidance on periods, pregnancy, nutrition, and government benefits.",
    ),

    # Intelligence section
    ("Cedar Intelligence", "ASHA Didi AI"),
    (
        "The financial intelligence healthcare has been waiting for",
        "The voice intelligence rural healthcare has been waiting for",
    ),
    (
        "Cedar Intelligence <strong>brings together deep healthcare financial data, advanced learning models, and proven outcomes</strong> to create a system that continuously adapts to patients and providers.",
        "ASHA Didi AI <strong>brings together maternal health data, advanced learning models, and proven outcomes</strong> to create a system that continuously adapts to women and ASHA workers.",
    ),
    (
        "Unlike general-purpose AI, <strong>Cedar Intelligence is built exclusively for patient financial engagement</strong>—understanding the nuances of billing, coverage, payments, and affordability to drive real results: higher collections, lower costs, and stronger patient trust.",
        "Unlike general-purpose AI, <strong>ASHA Didi is built exclusively for rural maternal health</strong>, understanding periods, pregnancy, nutrition, and danger signs to drive real results: earlier care, lower risk, and stronger trust.",
    ),
    (
        "It powers Cedar’s <strong>ability to personalize interactions, optimize the funnel, and unify channels</strong>—from digital payments to Kora, our intelligent voice agent.",
        "It powers ASHA AI's <strong>ability to personalize guidance, optimize village workflows, and unify channels</strong>, from voice sessions to ASHA Didi, our intelligent voice agent.",
    ),

    # Tabs
    ("Uninsured", "Adolescent girls"),
    ("Commercially Insured", "Pregnant women"),
    ("Underinsured", "New mothers"),

    # Clients section
    ("Leading providers rely on Cedar", "Leading partners rely on ASHA AI"),
    (
        "From health systems to physician groups and clinician service agencies, leading providers choose Cedar to transform their patient financial experience.",
        "From state health programs to NGOs and ASHA networks, leading partners choose ASHA AI to transform rural maternal health delivery.",
    ),

    # Touchpoints
    ("Get more from every financial touchpoint", "Get more from every health touchpoint"),
    ("Talk to an expert", "Talk to our team"),
    ("Increase your patients’ payments", "Increase private health access"),
    ("Boost third-party reimbursement", "Boost scheme enrollment"),
    ("Automate manual workflows", "Automate ASHA visit logs"),
    ("Reduce <br>Administrative Burden", "Reduce <br>field workload"),

    # Stats
    (
        "With billions of patient transactions and millions of lives served, Cedar’s data foundation powers better outcomes for every partner we serve.",
        "With millions of voice sessions and village-level insights, ASHA AI's data foundation powers better outcomes for every partner we serve.",
    ),
    ("Patient payment interactions", "Voice health sessions"),
    ("Patients served", "Women and girls served"),
    ("Patient payments processed", "Village visits supported"),

    # Solutions
    ("Cedar Solutions", "ASHA AI Platform"),
    ("The complete patient financial experience platform", "The complete voice-first maternal health platform"),
    ("Cedar pay", "Voice Care"),
    ("Increase Patient Payments", "Increase Voice Health Access"),
    ("Pre-Visit Payments", "Voice symptom checks"),
    ("Post-Visit Billing and Communications", "Cycle and pregnancy tracking"),
    ("Payment and Financing Options", "Nutrition and IFA reminders"),
    ("Cedar Pay", "Voice Care"),
    ("Cedar COVER", "Scheme Access"),
    ("Expand Coverage and Aid", "Expand scheme and benefit access"),
    ("Medicaid and ACA Enrollment", "Government scheme enrollment"),
    ("Maintain Medicaid Coverage", "IFA and ANC reminders"),
    ("Denials Resolution", "Risk alert resolution"),
    ("Cedar Cover", "Scheme Access"),
    ("Cedar Support", "ASHA Didi Support"),
    ("Automate Customer Support", "Automate field support"),
    ("Kora, Cedar’s AI Voice Agent", "ASHA Didi, our AI voice agent"),
    ("Call Center Servicing", "ASHA worker alerts"),
    ("Early Out Services", "SOS emergency workflows"),
    ("Smart Outbound Call Lists", "High-risk pregnancy lists"),
    ("Advanced Bill Summaries", "Digital health card summaries"),

    # Differentiators
    ("Expect more from your patient financial partner", "Expect more from your maternal health partner"),
    ("Accountable Partnership", "Village-First Partnership"),
    (
        "We go beyond vendor relationships—aligning incentives, co-creating solutions, and evolving with our clients to drive lasting performance.",
        "We go beyond software. We align with ASHA workers, co-create village workflows, and evolve with partners to drive lasting impact.",
    ),
    ("Complete Platform", "Complete Platform"),
    (
        "By consolidating fragmented tools and workflows, we streamline vendor management and create a more connected patient financial experience.",
        "By consolidating fragmented tools and workflows, we streamline field operations and create a more connected care experience for rural women.",
    ),
    (
        "Our platform learns from every interaction, using Cedar Intelligence to continuously refine engagement and deliver better experiences and outcomes.",
        "Our platform learns from every interaction, using ASHA Didi AI to continuously refine guidance and deliver better experiences and outcomes.",
    ),

    # Testimonials header
    ("Results that change lives", "Results that change lives"),
    (
        "We work shoulder-to-shoulder with our partners to help patients access and afford care. But don’t take our word for it.",
        "We work shoulder to shoulder with ASHA workers and partners to help women access dignified care. But do not take our word for it.",
    ),
    ("Explore customer stories", "Explore impact stories"),
    ("Provider", "Partner"),
    ("Patient", "Beneficiary"),

    # Demo section
    ("See Cedar in action", "See ASHA AI in action"),
    ("Empower the patients others write off", "Reach the women others leave behind"),
    (
        "We’ll show you how Cedar can simplify billing, increase coverage, and automate work—delivering stronger margins without added burden on your team.",
        "We will show you how ASHA AI can simplify voice care, increase scheme access, and automate field work without added burden on your ASHA teams.",
    ),

    # Nav products
    ("Cedar Pay", "Voice Care"),
    ("Cedar Cover", "Scheme Access"),
    ("Cedar Support", "ASHA Didi"),
    ("Cedar Intelligence", "ASHA Didi AI"),
    ("Cedar Talks", "ASHA Stories"),
    ("patient payments", "voice health guidance"),
    ("patient support", "ASHA worker support"),
    ("patient financial experience", "maternal health experience"),
    ("billing, streamlined payments", "voice guidance, offline sync"),
    ("What sets Cedar apart", "What sets ASHA AI apart"),

    # Footer sections
    ("Who we serve", "Who we serve"),
    ("Health Systems & Hospitals", "State health programs"),
    ("Clinician Services Providers", "NGOs and ASHA networks"),
    ("Careers & Life at Cedar", "Careers at ASHA AI"),
    ("Interviewing at Cedar", "Interviewing at ASHA AI"),
    ("Security at Cedar", "Security at ASHA AI"),
    ("See all the open roles that we have in Cedar", "See all the open roles we have at ASHA AI"),
    ("Career at Cedar", "Career at ASHA AI"),
    ("See how is become a part of Cedar", "See how to become part of ASHA AI"),
    ("Careers at Cedar", "Careers at ASHA AI"),
    ("It powers Cedar\u2019s ", "It powers ASHA AI's "),
    ("Cedar\u2019s ", "ASHA AI's "),
    (
        "By partnering with Cedar, we can give patients an innovative, best-in-class financial experience, ensuring that every part of our system works in coordination to create an effortless care experience for our patients.",
        "By partnering with ASHA AI, we can give women private, voice-first health guidance, ensuring every part of rural care works in coordination to create a dignified experience for mothers and girls.",
    ),
    (
        "Our partnership with ASHA AI will enable our physicians and APCs to continue to prioritize the patient experience with the confidence that Cedar\u2019s best-in-class digital platform will make the back-end process smooth and efficient. We want our patients to have the full spectrum of flexible payment options available to them when paying for medical services.",
        "Our partnership with ASHA AI will enable ASHA workers to prioritize village care with confidence that voice-first tools will make field visits smoother and more efficient. We want every woman to have dignified, private guidance when she needs it most.",
    ),
    (
        '"We constantly see payments increasing, and Cedar\u2019s communication strategy and user-friendly experience have helped us streamline the end-to-end billing process for patients"',
        '"We constantly see healthier outcomes improving, and ASHA AI\u2019s voice guidance and simple experience have helped us streamline maternal care across our villages"',
    ),
    (
        "I\u2019m excited about the energy at Cedar, seeing people so passionately engaged. I can\u2019t wait to see what they come up with next!",
        "I am excited about the energy at ASHA AI, seeing people so passionately engaged. I cannot wait to see what they build next!",
    ),
    (
        "By partnering with Cedar, we\u2019ll be able to streamline and simplify the payment process for all our members. further enhancing their overall experience with Tend, while unlocking new ways for us to elevate engagement.",
        "By partnering with ASHA AI, we will streamline and simplify health guidance for every woman in our program, further enhancing trust while unlocking new ways to elevate village engagement.",
    ),
    ('href="https://x.com/CedarNY"', 'href="https://x.com/asha_ai"'),

    # CTAs
    ("Schedule a demo", "Get started"),
    ("Book a Demo", "Get started"),
    ("Book a demo", "Get started"),

    # Footer disclaimer (remove em dash style issues)
    (
        "Product visuals and descriptions may be in development and are subject to change.",
        "Product visuals and descriptions may be in development and are subject to change.",
    ),
]

# href replacements for app integration (keep ditto nav structure, route into app)
HREF_REPLACEMENTS = [
    ('href="/book-a-demo"', 'href="/role-select"'),
    ('href="/solutions/cedar-pay"', 'href="/role-select?role=beneficiary"'),
    ('href="/solutions/cedar-cover"', 'href="/role-select?role=beneficiary"'),
    ('href="/solutions/cedarsupport"', 'href="/role-select?role=asha_worker"'),
    ('href="/solutions/kora-ai"', 'href="/role-select"'),
    ('href="/solutions/cedar-intelligence"', 'href="/role-select"'),
    ('href="/about-us"', 'href="/role-select"'),
    ('href="/careers"', 'href="/role-select"'),
    ('href="/careers/open-roles"', 'href="/role-select"'),
    ('href="/careers/interviewing-at-cedar"', 'href="/role-select"'),
    ('href="/blog"', 'href="/role-select"'),
    ('href="/press"', 'href="/role-select"'),
    ('href="/resources"', 'href="/role-select"'),
    ('href="/resources/case-studies"', 'href="/role-select"'),
    ('href="/resources/cedar-talk"', 'href="/role-select"'),
    ('href="/resources/whitepapers"', 'href="/role-select"'),
    ('href="/resources/calculator-cedar"', 'href="/role-select"'),
    ('href="/solutions/implementation"', 'href="/role-select"'),
    ('href="/who-we-serve/health-systems-hospitals"', 'href="/role-select?role=partner"'),
    ('href="/who-we-serve/clinician-services-providers"', 'href="/role-select?role=asha_worker"'),
    ('href="/legal/privacy-policy"', 'href="/role-select"'),
    ('href="/legal/terms-of-use"', 'href="/role-select"'),
]

def main():
    text = HTML.read_text(encoding="utf-8")

    # Ensure relative assets resolve when landing is served from site root
    if "<base href=\"/landing/\">" not in text:
        text = text.replace(
            "<head><meta charset=\"utf-8\">",
            "<head><meta charset=\"utf-8\"><base href=\"/landing/\">",
            1,
        )

    # Remove em dashes and en dashes in visible copy patterns
    text = text.replace("\u2014", ". ")
    text = text.replace("\u2013", ", ")

    for old, new in REPLACEMENTS:
        text = text.replace(old, new)

    for old, new in HREF_REPLACEMENTS:
        text = text.replace(old, new)

    # Remaining standalone Cedar brand (careful order, skip asset paths)
    text = re.sub(r">\s*Cedar\s*<", ">ASHA AI<", text)
    for old in (" at Cedar", " in Cedar", "with Cedar", "partnering with Cedar"):
        text = text.replace(old, old.replace("Cedar", "ASHA AI"))

    # Fix double replacements
    text = text.replace("ASHA AI AI", "ASHA Didi AI")
    text = text.replace("ASHA AI Didi AI", "ASHA Didi AI")
    text = text.replace("ASHA AI's", "ASHA AI's")

    HTML.write_text(text, encoding="utf-8")
    print(f"Updated {HTML} ({len(text)} chars)")

if __name__ == "__main__":
    main()
